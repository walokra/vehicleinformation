const { ApolloServer, gql } = require("apollo-server-cloud-functions");
const { SQLDataSource } = require("datasource-sql");
const knex = require("knex");

const databaseName = process.env.DATABASE_NAME || "vehicledata";
const databaseUser = process.env.POSTGRES_DB_USER || "postgres";
const databasePassword = process.env.POSTGRES_DB_PASSWORD || "postgres";
const databaseHost = process.env.POSTGRES_DB_HOST || "localhost";
const databasePort = process.env.POSTGRES_DB_PORT || "5432";

const knexConfig = knex({
  client: "pg",
  debug: true,
  connection: {
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
  },
});

class VehicleDatabase extends SQLDataSource {
  getVehicles(args) {
    const limit = args.limit || 100;
    const offset = args.offset || 0;
    return this.knex
      .select("*")
      .limit(limit)
      .offset(offset)
      .from("tekniset_tiedot_mat_view");
  }
  searchVehiclesByMerkkiMalli(args) {
    console.log({ args });
    return this.knex
      .select("*")
      .modify(function (query) {
        if (args.merkki) {
          query.whereILike("merkkiselvakielinen", args.merkki);
        }
        if (args.malli) {
          query.whereILike("mallimerkinta", args.malli);
        }
        if (args.kayttoonottopvm) {
          query.where("kayttoonottopvm", ">", args.kayttoonottopvm);
        }
        if (args.sahkohybridi) {
          query.where("sahkohybridi", true);
        }
      })
      .from("tekniset_tiedot_mat_view");
  }
}

const db = new VehicleDatabase(knexConfig);

// typeDefs
const typeDefs = gql`
  type TechnicalInformation {
    ajoneuvoluokka: String
    ensirekisterointipvm: String
    ajoneuvoryhma: Int
    ajoneuvonkaytto: String
    variantti: String
    versio: String
    kayttoonottopvm: Int
    vari: String
    ovienLukumaara: Int
    korityyppi: String
    ohjaamotyyppi: Int
    istumapaikkojenLkm: Int
    omamassa: Int
    teknSuurSallKokmassa: Int
    tieliikSuurSallKokmassa: Int
    ajonKokPituus: Int
    ajonLeveys: Int
    ajonKorkeus: Int
    kayttovoima: String
    iskutilavuus: Int
    suurinNettoteho: Float
    sylintereidenLkm: Int
    ahdin: String
    sahkohybridi: String
    sahkohybridinluokka: String
    merkkiSelvakielinen: String
    mallimerkinta: String
    vaihteisto: String
    vaihteidenLkm: Int
    kaupallinenNimi: String
    voimanvalJaTehostamistapa: String
    tyyppihyvaksyntanro: String
    yksittaisKayttovoima: String
    kunta: String
    co2: Int
    matkamittarilukema: Int
    valmistenumero2: String
    jarnro: Int
  }

  type Query {
    vehicles(offset: Int, limit: Int): [TechnicalInformation]
    searchVehiclesByMerkkiMalli(
      merkki: String
      malli: String
      kayttoonottopvm: Int
      sahkohybridi: Boolean
    ): [TechnicalInformation]
  }
`;

// resolvers
const resolvers = {
  Query: {
    vehicles: async (_, args, context) => {
      return context.dataSources.db.getVehicles(args);
    },
    searchVehiclesByMerkkiMalli: async (parent, args, context, info) => {
      return context.dataSources.db.searchVehiclesByMerkkiMalli(args);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ db }),
});

module.exports = {
  main: server.createHandler(),
  db: db,
  typeDefs: typeDefs,
  resolvers: resolvers,
};
