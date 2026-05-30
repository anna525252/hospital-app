import { doctors, patients } from '@/lib/store';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 4);
    const search = searchParams.get("search") || "";
    const doctorId = searchParams.get("doctorId") || "";

    const patientsWithDoctors = patients.map((patient) => {
        const doctor = doctors.find((d) => d.id === patient.doctorId);
        return { ...patient, doctor };
    });

    const filtered = patientsWithDoctors.filter((patient) => {
        const matchesSearch = search
            ? patient.fullName.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesDoctor = doctorId ? patient.doctorId === doctorId : true;
        return matchesSearch && matchesDoctor;
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);

    return Response.json({
        items,
        total: filtered.length,
        page,
        pages: Math.ceil(filtered.length / limit),
    });
}

export async function POST(req: Request) {
    const body = await req.json();

    if (!body.fullName || typeof body.fullName !== "string") {
        return Response.json(
            { error: "Поле 'fullName' обязательно и должно быть строкой" },
            { status: 422 }
        );
    }
    if (
        body.fullName.trim().length < 3 ||
        body.fullName.trim().length > 100
    ) {
        return Response.json(
            { error: "ФИО должно содержать от 3 до 100 символов" },
            { status: 422 }
        );
    }

    const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;

    if (!nameRegex.test(body.fullName.trim())) {
        return Response.json(
            { error: "ФИО может содержать только буквы, пробелы и дефис" },
            { status: 422 }
        );
    }

    if (
        body.age === undefined ||
        typeof body.age !== "number" ||
        body.age < 0 ||
        body.age > 120
    ) {
        return Response.json(
            { error: "Возраст должен быть от 0 до 120 лет" },
            { status: 422 }
        );
    }

    if (!body.diagnosis || typeof body.diagnosis !== "string") {
        return Response.json(
            { error: "Поле 'Диагноз' обязательно и должно быть строкой" },
            { status: 422 }
        );
    }

    if (
        body.diagnosis.trim().length < 3 ||
        body.diagnosis.trim().length > 200
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

    if (!body.doctorId || typeof body.doctorId !== "string") {
        return Response.json(
            { error: "Поле 'doctorId' обязательно" },
            { status: 422 }
        );
    }

    const doctorExists = doctors.find((d) => d.id === body.doctorId);
    if (!doctorExists) {
        return Response.json(
            { error: "Врач с таким id не найден" },
            { status: 422 }
        );
    }

    const newPatient = {
        id: crypto.randomUUID(),
        fullName: body.fullName,
        age: body.age,
        diagnosis: body.diagnosis,
        admittedAt: new Date().toISOString(),
        isCritical: body.isCritical ?? false,
        doctorId: body.doctorId,
        notes: body.notes,
    };

    patients.push(newPatient);

    return Response.json(newPatient, { status: 201 });
}
