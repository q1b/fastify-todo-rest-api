import { FastifyPluginAsync } from 'fastify';

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get<{
		Querystring: {
			id: string;
		};
	}>('/', async function (req, reply) {
		const { id } = req.query;
		if (id)
			return await fastify.prisma.todos.findFirst({
				where: {
					id,
				},
			});
		else await fastify.prisma.todos.findMany();
	});

	fastify.post<{
		Querystring: {
			group_id: string;
		};
		Body: {
			label: string;
		};
	}>('/', async (req, res) => {
		const { group_id } = req.query;
		const { label } = req.body;
		if (label && group_id) {
			const todo = await fastify.prisma.todos.create({
				data: {
					label,
					groupId: group_id,
				},
			});
			return todo;
		} else {
			return { msg: 'rejected' };
		}
	});

	fastify.put<{
		Params: {
			id: string;
		};
		Body: {
			label: string;
			done: boolean;
		};
	}>('/:id', async (req, res) => {
		const { id } = req.params;
		const { label, done } = req.body;
		if (id && label && done) {
			return await fastify.prisma.todos.update({
				data: {
					label,
					done: {
						set: done,
					},
				},
				where: {
					id,
				},
			});
		} else if (id && label) {
			return await fastify.prisma.todos.update({
				data: {
					label,
				},
				where: {
					id,
				},
			});
		} else {
			return { msg: 'rejected' };
		}
	});

	fastify.put<{
		Params: {
			id: string;
		};
	}>('/:id/completed', async (req, res) => {
		const { id } = req.params;
		if (id) {
			return await fastify.prisma.todos.update({
				data: {
					done: {
						set: true,
					},
				},
				where: {
					id,
				},
			});
		}
	});

	fastify.put<{
		Params: {
			id: string;
		};
	}>('/:id/incompleted', async (req, res) => {
		const { id } = req.params;
		if (id) {
			return await fastify.prisma.todos.update({
				data: {
					done: {
						set: false,
					},
				},
				where: {
					id,
				},
			});
		}
	});

	fastify.delete<{
		Querystring: {
			id: string;
		};
	}>('/', async (req, res) => {
		const { id } = req.query;
		if (id) {
			return await fastify.prisma.todos.delete({
				where: {
					id,
				},
			});
		}
	});
};

export default example;
