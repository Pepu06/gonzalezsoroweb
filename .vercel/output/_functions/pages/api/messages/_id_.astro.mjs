import { c as connectDB, M as Message } from '../../../chunks/db_connection_QpJ2SUVb.mjs';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

async function PUT({ params, request }) {
    try {
        await connectDB();
        const { id } = params;

        // Parse the multipart form data
        const formData = await request.formData();
        const text = formData.get('text');
        const imageFile = formData.get('image');
        const removeImage = formData.get('removeImage');

        let imageUrl = null;

        // Handle image upload if present
        if (imageFile) {
            const buffer = await imageFile.arrayBuffer();
            const filename = `${Date.now()}-${imageFile.name}`;
            const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

            await writeFile(filepath, Buffer.from(buffer));
            imageUrl = `/uploads/${filename}`;
        }

        // Get current message to handle image deletion
        const currentMessage = await Message.findById(id);

        // If there's an existing image and we're either uploading a new one or removing it
        if (currentMessage.image && (imageUrl || removeImage === 'true')) {
            const oldImagePath = path.join(process.cwd(), 'public', currentMessage.image);
            try {
                await unlink(oldImagePath);
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        // Update message
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            {
                text,
                ...(imageUrl ? { image: imageUrl } : {}),
                ...(removeImage === 'true' ? { image: null } : {})
            },
            { new: true }
        );

        return new Response(JSON.stringify(updatedMessage), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Server error:', error);
        return new Response(
            JSON.stringify({ error: 'Server error', message: error.message }),
            { status: 500 }
        );
    }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    PUT,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
