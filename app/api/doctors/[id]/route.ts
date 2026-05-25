import { doctors } from '@/lib/store';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const index = doctors.findIndex((d) => d.id === id);

    if (index === -1) {
        return Response.json(
            { error: "Врач не найден" },
            { status: 404 }
        );
    }

    doctors.splice(index, 1);

    return Response.json({ success: true });
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();

    const doctor = doctors.find(
        (d) => d.id === id
    );

    if (!doctor) {
        return Response.json(
            { error: "Врач не найден" },
            { status: 404 }
        );
    }

    if (
        body.fullName !== undefined &&
        (
            typeof body.fullName !== "string" ||
            body.fullName.trim().length < 3 ||
            body.fullName.trim().length > 100 ||
            !/^[А-Яа-яЁёA-Za-z\s-]+$/.test(body.fullName)
        )
    ) {
        return Response.json(
            { error: "Некорректное имя врача" },
            { status: 422 }
        );
    }

    if (
        body.specialization !== undefined &&
        body.specialization.trim().length < 2
    ) {
        return Response.json(
            { error: "Специализация слишком короткая" },
            { status: 422 }
        );
    }

    if (
        body.experience !== undefined &&
        (typeof body.experience !== "number" ||
            body.experience < 0 ||
            body.experience > 60)
    ) {
        return Response.json(
            { error: "Стаж должен быть от 0 до 60 лет" },
            { status: 422 }
        );
    }

    if (
        body.email !== undefined &&
        body.email
    ) {
        const emailExists = doctors.find(
            (d) => d.email === body.email && d.id !== doctor.id
        );

        if (emailExists) {
            return Response.json(
                { error: "Врач с таким email уже существует" },
                { status: 422 }
            );
        }
    }

    if (body.fullName !== undefined)
        doctor.fullName = body.fullName;

    if (body.specialization !== undefined)
        doctor.specialization = body.specialization;

    if (body.experience !== undefined)
        doctor.experience = body.experience;

    if (body.email !== undefined)
        doctor.email = body.email;

    if (body.isAvailable !== undefined)
        doctor.isAvailable = body.isAvailable;

    return Response.json(doctor);
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const doctor = doctors.find((d) => d.id === id);

    if (!doctor) {
        return Response.json(
            { error: "Врач не найден" },
            { status: 404 }
        );
    }

    return Response.json(doctor);
}