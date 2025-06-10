import { app } from './app';
import { logger } from './core/logger';

const port = Number(process.env.PORT || 3000);

const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

const onCloseSignal = () => {
    logger.info('sigint received, shutting down');
    server.close(() => {
        logger.info('server closed');
        process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
