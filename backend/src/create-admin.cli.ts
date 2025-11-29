// src/create-admin.cli.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as bcrypt from 'bcrypt';
import { AdminService } from './infrastructure/services/admin.service';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);

  try {
    // Vérifier si admin existe déjà
    const admins = await adminService.findAll();
    
    if (admins.length > 0) {
      console.log('⚠️  Un admin existe déjà');
      const existing = admins[0];
      console.log(`   Email: ${existing.email}`);
      await app.close();
      return;
    }

    // Créer l'admin par défaut
    // const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await adminService.create({
      nom: 'Admin',
      email: 'admin@example.com',
      motDePasse: 'admin123',
    });

    console.log('✅ Admin créé avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Mot de passe: admin123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!');
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  } finally {
    await app.close();
  }
}

createAdmin();