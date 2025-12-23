# Agent Documentation

This document provides information about agent-related functionality in this project.

## Overview

This project includes several agent implementations and integrations:

- **Coding Agent**: A minimal viable coding agent that can use tools like `list_files`, `read_file`, and `edit_file`
- **Hyperbrowser Agent**: Browser automation agent for web scraping and monitoring tasks

## Coding Agent

The coding agent implementation is documented in the blog post: [Building a minimal viable coding agent](/posts/2025-04-15-agent).

### Key Components

- **Agent Class**: Handles conversation loops and tool invocation
- **Tools**: File system operations (read, list, edit)
- **Inference**: Determines the agent's next action based on context

### Usage

```typescript
import { Agent } from "./src/agent";

const agent = new Agent();
await agent.run();
```

## Hyperbrowser Agent

Used for browser automation tasks, such as monitoring websites and sending alerts.

### Configuration

The Hyperbrowser agent is configured in `app/lib/ebi.ts` and can be used to:
- Navigate websites
- Extract data from pages
- Monitor changes and send alerts

### Example

See `scripts/test-ebi.ts` for example usage of the Hyperbrowser agent.

## Development

To work with agents in this project:

1. Ensure you have the necessary API keys configured (e.g., `ANTHROPIC_API_KEY` for coding agents)
2. Run agent scripts using Bun: `bun scripts/<script-name>.ts`
3. Check logs and traces for debugging agent behavior
