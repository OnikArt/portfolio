import { initialTariffs, services, siteSettings } from "@/data/site";

// Published, hand-reviewed content already present in the repository/seed.
// Never add private CMS tables, contacts from admin settings, or credentials here.
export const publicSnapshot = {
  settings: siteSettings,
  services: services.map((item, index) => ({
    id: `service-static-${index + 1}`,
    number: item.number,
    kicker: item.kicker,
    title: item.title,
    description: item.description,
    items: JSON.stringify(item.items),
  })),
  tariffs: initialTariffs.map((item, index) => ({
    id: `tariff-static-${index + 1}`,
    name: item.name,
    eyebrow: item.eyebrow,
    description: item.description,
    price_mode: item.priceMode,
    price_from: null as number | null,
    features: JSON.stringify(item.features),
    cta: "Обсудить проект",
  })),
  projects: [{
    title: "ФАСАДОФ",
    slug: "fasadof",
    subtitle: "Цифровая инфраструктура для бизнеса фасадов и столешниц.",
    short_description: "Цифровая инфраструктура для бизнеса фасадов и столешниц.",
    status: "IN_PROGRESS",
    published: true,
    featured: true,
    service_tags: JSON.stringify(["Strategy", "Design", "Development", "Infrastructure"]),
    cover: null as string | null,
    seo_title: "Фасадоф — кейс OnikArt",
    seo_description: "Архитектура цифровой инфраструктуры для бизнеса фасадов и столешниц.",
  }],
  projectBlocks: {
    fasadof: [
      ["BRAND", "Индивидуальный дизайн и brandbook.", "Визуальная система и брендбук формируют единый образ компании во всех цифровых точках контакта."],
      ["WEB", "Публичный сайт и адаптивный интерфейс.", "Публичный сайт спроектирован как понятная точка входа в продукты и услуги компании на любых устройствах."],
      ["CATALOG", "Каталог и карточки продукции.", "Структурированный каталог помогает изучать материалы и направления без перегрузки интерфейса."],
      ["ADMIN", "Управление контентом и внутренними процессами.", "Админ-панель объединяет управление контентом, обращениями и рабочими данными проекта."],
      ["MAX", "Система бота и операционных уведомлений.", "Бот передаёт значимые события ответственным людям и связывает сайт с операционной работой."],
      ["SOCIAL", "Оформление и ведение социальных каналов.", "Социальные каналы поддерживают общий визуальный язык и работают как часть единой digital-системы."],
      ["ANALYTICS", "События и operational analytics.", "Система фиксирует реальные события и даёт основу для последующего анализа без выдуманных метрик."],
      ["INFRASTRUCTURE", "Production, persistence и развитие.", "Инфраструктура обеспечивает production-запуск, сохранность данных и возможность дальнейшего расширения."],
    ].map(([title, shortText, detailText], index) => ({
      id: `fasadof-system-${title.toLowerCase()}`,
      data: JSON.stringify({ number: String(index + 1).padStart(2, "0"), title, shortText, detailText }),
    })),
  },
};
