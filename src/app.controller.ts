import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

interface Environment {
  id: string;
  name: string;
  region: string;
  stage: string;
  status: 'active' | 'provisioning' | 'stopped';
  createdAt: string;
}

// In-memory store (demo only)
const environments: Environment[] = [
  {
    id: '1',
    name: 'production-eu',
    region: 'eu-central-1',
    stage: 'prod',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'staging-us',
    region: 'us-east-1',
    stage: 'staging',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

@Controller()
export class AppController {
  @Get('/health')
  health() {
    return {
      status: 'ok',
      version: process.env.npm_package_version ?? '1.0.0',
      env: process.env.NODE_ENV ?? 'production',
      uptime: Math.floor(process.uptime()),
    };
  }

  @Get()
  root() {
    return {
      name: 'CloudPilot Demo API',
      version: '1.0.0',
      docs: '/health',
      endpoints: [
        'GET  /health',
        'GET  /environments',
        'POST /environments',
        'DELETE /environments/:id',
      ],
    };
  }

  @Get('/environments')
  listEnvironments() {
    return {
      data: environments,
      total: environments.length,
    };
  }

  @Post('/environments')
  createEnvironment(@Body() body: { name: string; region: string; stage: string }) {
    const env: Environment = {
      id: Date.now().toString(),
      name: body.name,
      region: body.region ?? 'eu-central-1',
      stage: body.stage ?? 'dev',
      status: 'provisioning',
      createdAt: new Date().toISOString(),
    };
    environments.push(env);

    // Simulate async provisioning
    setTimeout(() => {
      env.status = 'active';
    }, 3000);

    return env;
  }

  @Delete('/environments/:id')
  deleteEnvironment(@Param('id') id: string) {
    const index = environments.findIndex((e) => e.id === id);
    if (index === -1) {
      return { error: 'Environment not found' };
    }
    environments.splice(index, 1);
    return { success: true };
  }
}
