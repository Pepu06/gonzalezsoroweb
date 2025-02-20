import { Department, connectDB } from '../../../lib/db_connection.js';

export const prerender = false;

export async function getStaticPaths() {
    await connectDB();
    const departments = await Department.find({});
    return departments.map(dept => ({
        params: { id: dept._id.toString() }
    }));
}

export async function PUT({ params, request }) {
    const { id } = params;
    try {
        const body = await request.json();
        const { address } = body;

        if (!address) {
            return new Response(JSON.stringify({ error: 'Address is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectDB();
        const department = await Department.findByIdAndUpdate(
            id,
            { address },
            { new: true }
        );

        if (!department) {
            return new Response(JSON.stringify({ error: 'Department not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(department), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating department:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}