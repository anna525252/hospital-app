import { patients, doctors } from "@/lib/store";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const index = patients.findIndex((p) => p.id === id);

    if (index === -1) {
        return Response.json(
            { error: "Пациент не найден" },
            { status: 404 }
        );
    }

    patients.splice(index, 1);

    return Response.json({ success: true });
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();

    const patient = patients.find((p) => p.id === id);

    if (!patient) {
        return Response.json(
            { error: "Пациент не найден" },
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
            { error: "Некорректное имя пациента" },
            { status: 422 }
        );
    }

    if (
        body.age !== undefined &&
        (typeof body.age !== "number" ||
            body.age < 0 ||
            body.age > 120)
    ) {
        return Response.json(
            { error: "Возраст должен быть от 0 до 120 лет" },
            { status: 422 }
        );
    }

    if (
        body.diagnosis !== undefined &&
        (
            typeof body.diagnosis !== "string" ||
            body.diagnosis.trim().length < 3 ||
            body.diagnosis.trim().length > 200
        )
    ) {
        return Response.json(
            { error: "Диагноз должен содержать от 3 до 200 символов" },
            { status: 422 }
        );
    }

    if (
        body.notes !== undefined &&
        typeof body.notes === "string" &&
        body.notes.length > 500
    ) {
        return Response.json(
            { error: "Заметки не должны превышать 500 символов" },
            { status: 422 }
        );
    }

    if (body.doctorId !== undefined) {
        const doctorExists = doctors.find(
            (d) => d.id === body.doctorId
        );

        if (!doctorExists) {
            return Response.json(
                { error: "Врач не найден" },
                { status: 422 }
            );
        }
    }

    if (body.fullName !== undefined) patient.fullName = body.fullName;
    if (body.age !== undefined) patient.age = body.age;
    if (body.diagnosis !== undefined) patient.diagnosis = body.diagnosis;
    if (body.doctorId !== undefined) patient.doctorId = body.doctorId;

    return Response.json(patient);
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const patient = patients.find((p) => p.id === id);

    if (!patient) {
        return Response.json(
            { error: "Пациент не найден" },
            { status: 404 }
        );
    }

    const doctor = doctors.find((d) => d.id === patient.doctorId);

    return Response.json({ ...patient, doctor });
}