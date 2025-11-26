import { Module } from '@nestjs/common';

/**
 * CoreModule contient les entités du domaine et les interfaces des repositories
 * C'est la couche la plus interne - pas de dépendances externes
 * Les autres modules dépendent de Core, mais Core ne dépend de personne
 */
@Module({
  providers: [],
  exports: [],
})
export class CoreModule {}