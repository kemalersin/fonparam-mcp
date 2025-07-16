#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { FonParamApiClient } from './api-client.js';
import { FonParamTools } from './tools.js';

class FonParamMCPServer {
  private server: Server;
  private apiClient: FonParamApiClient;
  private tools: FonParamTools;

  constructor() {
    this.server = new Server(
      {
        name: 'fonparam-mcp',
        version: '1.0.0',
      }
    );

    // API client ve tools'u başlat
    this.apiClient = new FonParamApiClient();
    this.tools = new FonParamTools(this.apiClient);

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // Mevcut araçları listele
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools.getTools(),
      };
    });

    // Araç çağrılarını işle
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.tools.handleToolCall(name, args || {});
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
        
        throw new McpError(
          ErrorCode.InternalError,
          `FonParam API Error: ${errorMessage}`
        );
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    // Sunucuyu başlat
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // API bağlantısını test et
    try {
      const isHealthy = await this.apiClient.healthCheck();
      if (!isHealthy) {
        console.error('[FonParam MCP] Warning: API connection test failed');
      } else {
        console.error('[FonParam MCP] API connection successful');
      }
    } catch (error) {
      console.error('[FonParam MCP] API health check failed:', error);
    }

    console.error('[FonParam MCP] Server started successfully');
  }
}

// Ana fonksiyon
async function main() {
  const server = new FonParamMCPServer();
  await server.run();
}

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('[FonParam MCP] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FonParam MCP] Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Sunucuyu başlat
main().catch((error) => {
  console.error('[FonParam MCP] Failed to start server:', error);
  process.exit(1);
}); 