#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('vault')
  .description('SnippetVault CLI - terminal-first code snippet management')
  .version('0.0.0');

// TODO: Implement commands (init, save, search, copy, list)

program.parse();
