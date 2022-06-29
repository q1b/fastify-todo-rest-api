import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get('/', async (res, reply) => {
		return { 'Hello World': 'I am here' };
	});
};

export default root;
