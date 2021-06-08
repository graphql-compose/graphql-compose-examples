import { schemaComposer } from './schemaComposer';
import { DroidTC, PersonTC, CharacterDTC } from './models';

schemaComposer.Query.addFields({
  characterMany: CharacterDTC.getResolver('findMany'),
  characterById: CharacterDTC.getResolver('findById'),
  droidMany: DroidTC.getResolver('findMany'),
  droidById: DroidTC.getResolver('findById'),
  personMany: PersonTC.getResolver('findMany'),
  personById: PersonTC.getResolver('findById'),
});

schemaComposer.Mutation.addFields({
  characterCreate: CharacterDTC.getResolver('createOne'),
  droidCreate: DroidTC.getResolver('createOne'),
  personCreate: PersonTC.getResolver('createOne'),
});

export default schemaComposer.buildSchema();
