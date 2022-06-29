import { FastifyPluginAsync } from 'fastify';

/*
    Get todoGroup
    Post todoGroup 
    Put todoGroup
    Delete todoGroup
*/

const todo_group: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get<{ Querystring: { id: string; todos: boolean } }>(
		'/',
		async (req, reply) => {
			const { id, todos } = req.query;
			if (id && todos)
				return await fastify.prisma.todoGroup
					.findFirst({
						where: {
							id,
						},
					})
					.todos();
			else if (id) {
				return await fastify.prisma.todoGroup.findFirst({
					where: {
						id,
					},
				});
			} else {
				return await fastify.prisma.todoGroup.findMany();
			}
		},
	);

	fastify.post<{ Body: { label: string; todos: any[] } }>(
		'/',
		async (res, reply) => {
			console.log('body Response', res.body);
			console.dir(res.body);
			const { label, todos } = res.body;
			if (label) {
				if (todos instanceof Array) {
					try {
						const todoGroup = await fastify.prisma.todoGroup.create(
							{
								data: {
									label,
									todos: {
										createMany: {
											data: todos.map((todo) => ({
												label: todo.label,
												done: todo?.done
													? todo.done
													: false,
											})),
										},
									},
								},
								include: {
									todos: true,
								},
							},
						);
						return todoGroup;
					} catch (error) {
						console.log(error);
					}
				} else {
					const todoGroup = await fastify.prisma.todoGroup.create({
						data: {
							label,
						},
					});
					return todoGroup;
				}
			}
			return { msg: 'rejected' };
		},
	);

	interface IQuerystring {
		id: string;
	}

	fastify.put<{ Body: { label: string }; Params: IQuerystring }>(
		'/:id',
		async (res, reply) => {
			const { id } = res.params;
			const { label } = res.body;
			if (id && label)
				return await fastify.prisma.todoGroup.update({
					data: {
						label,
					},
					where: {
						id: id,
					},
				});
			else return { msg: 'rejected' };
		},
	);

	fastify.put<{ Params: { id: string } }>(
		'/:id/views',
		async (res, reply) => {
			const { id } = res.params;
			if (id) {
				return await fastify.prisma.todoGroup.update({
					data: {
						viewCount: {
							increment: 1,
						},
					},
					where: {
						id: id,
					},
				});
			} else return { msg: 'rejected', res };
		},
	);

	fastify.delete<{ Querystring: IQuerystring }>('/', async (res, reply) => {
		const { id } = res.query;
		if (id)
			return await fastify.prisma.todoGroup.delete({
				where: {
					id: id,
				},
			});
		else return { msg: 'todo_group_delete_error' };
	});
};

export default todo_group;
