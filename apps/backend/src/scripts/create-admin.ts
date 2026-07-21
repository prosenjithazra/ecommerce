import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin User';
  const role = process.argv[5] || 'super_admin';

  if (!email || !password) {
    console.log('\n❌ Usage: npm run create-admin <email> <password> [name] [role]\n');
    console.log('Example: npm run create-admin admin2@example.com AdminPass123! "Jane Admin" super_admin\n');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    const user = await userService.register({
      name,
      email,
      password,
      phone: '',
      role,
      status: 'Active',
    });
    console.log(`\n✅ Admin user created successfully!`);
    console.log(`- ID: ${user.id}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Status: ${user.status}\n`);
  } catch (err: any) {
    console.error(`\n❌ Failed to create admin: ${err.message}\n`);
  } finally {
    await app.close();
  }
}

bootstrap();
