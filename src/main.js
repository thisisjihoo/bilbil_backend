import "./env";
import logger from "./config/logger";
import { getDatabase, initDatabase, initQueryBuilder } from "./config/db";
import { createServer } from "https"; // Changed from 'http' to 'https'
import { initWebSocket } from "./ws";
import { getCache, initCache } from "@/config/cache";
import { insertAreaToDatabase, isAreaDataExist } from "@/area-csv/insert-database";
import { parseArea, parseRawAreaCsv } from "@/area-csv/parse";
import { initExpress } from "@/app";
import { initS3Client } from "@/config/aws";

(async () => {
    try {
        logger.info("Initializing database.");
        await initDatabase();
        await initQueryBuilder();
        const testConnection = await getDatabase().getConnection();
        await testConnection.release();
    } catch (e) {
        logger.error("Failed to init database.", e);
        process.exit(1);
    }

    try {
        logger.info("Initializing cache.");
        await initCache();
        await getCache();
    } catch (e) {
        logger.error("Failed to init cache.", e);
        process.exit(1);
    }

    try {
        logger.info("Initializing S3 client.");
        await initS3Client();
    } catch (e) {
        logger.error("Failed to initialized AWS S3 client.", e);
    }

    try {
        logger.info("Checking if area data exists in database.");
        if (!await isAreaDataExist()) {
            logger.info("Area data does not exist in database. Inserting area data to database.");
            const rawAreaRecords = await parseRawAreaCsv();
            const areaData = parseArea(rawAreaRecords);
            await insertAreaToDatabase(areaData);
        } else {
            logger.info("Area data already exists in database. Skip inserting area data to database.");
        }
    } catch (e) {
        logger.error("Failed to insert area data to database.", e);
        process.exit(1);
    }

    try {
        const port = process.env.PORT || 3000;

        const app = await initExpress();
        const server = createServer(app);
        initWebSocket(server);

        server.listen(port);
        logger.info(`Server listening on port ${port}.`);
    } catch (e) {
        logger.error("Failed to init web server.", e);
        process.exit(1);
    }

    process.on("exit", () => {
        const dbConnection = getDatabase();
        dbConnection.close().catch(e => logger.error("Failed to disconnect db.", e));

        getCache().then(connection => connection.disconnect())
            .catch(e => logger.error("Failed to disconnect cache", e));
    });
})();
