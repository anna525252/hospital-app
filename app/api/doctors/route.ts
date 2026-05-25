import { doctors } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);

  const start = (page - 1) * limit;
  const end = start + limit;

  const items = doctors.slice(start, end);

  return Response.json({
    items,
    total: doctors.length,
    page,
    pages: Math.ceil(doctors.length / limit),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.fullName || typeof body.fullName !== "string") {
    return Response.json(
      { error: "Поле 'fullName' обязательно и должно быть строкой" },
      { status: 422 },
    );
  }

  if (body.fullName.trim().length < 3 || body.fullName.trim().length > 100) {
    return Response.json(
      { error: "ФИО должно содержать от 3 до 100 символов" },
      { status: 422 },
    );
  }

  const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;

  if (!nameRegex.test(body.fullName.trim())) {
    return Response.json(
      { error: "ФИО может содержать только буквы, пробелы и дефис" },
      { status: 422 },
    );
  }

  if (!body.specialization || typeof body.specialization !== "string") {
    return Response.json(
      { error: "Поле 'specialization' обязательно и должно быть строкой" },
      { status: 422 },
    );
  }

  if (
    body.specialization.trim().length < 2 ||
    body.specialization.trim().length > 50
  ) {
    return Response.json(
      { error: "Специализация должна содержать от 2 до 50 символов" },
      { status: 422 },
    );
  }

  if (
    body.experience === undefined ||
    typeof body.experience !== "number" ||
    body.experience < 0 ||
    body.experience > 60
  ) {
    return Response.json(
      { error: "Стаж должен быть от 0 до 60 лет" },
      { status: 422 },
    );
  }

  if (body.email) {
    if (typeof body.email !== "string") {
      return Response.json(
        { error: "Поле 'email' должно быть строкой" },
        { status: 422 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email)) {
      return Response.json(
        { error: "Некорректный формат email" },
        { status: 422 },
      );
    }

    const emailExists = doctors.find((d) => d.email === body.email);
    if (emailExists) {
      return Response.json(
        { error: "Врач с таким email уже существует" },
        { status: 422 },
      );
    }
  }

  const newDoctor = {
    id: `doctor-${Date.now()}`,
    fullName: body.fullName,
    specialization: body.specialization,
    experience: body.experience,
    isAvailable: body.isAvailable ?? true,
    email: body.email || "",
    gender: body.gender,
  };

  doctors.push(newDoctor);

  return Response.json(newDoctor, { status: 201 });
}