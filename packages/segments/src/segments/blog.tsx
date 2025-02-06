import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const blogs = [
  {
    title: "Boost your conversion rate",
    date: "Mar 16, 2020",
    category: "Marketing",
    href: "#",
    description:
      "As a small business owner, I thought advanced AI was out of reach. This solution proved me wrong. It's affordable, scalable, and has dramatically improved our customer service efficiency.",
    author: {
      name: "Emily Chen",
      role: "Co-Founder / CEO",
      href: "#",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-1.svg",
    },
    image:
      "https://ui.convertfa.st/images/convertfast-demo.png",
  },
  {
    title: "How to use search engine optimization to drive sales",
    date: "Mar 10, 2020",
    category: "Sales",
    href: "#",
    description:
      "The AI-powered analytics dashboard revolutionized our decision-making process. It's intuitive, fast, and provides insights we never knew we needed. Absolutely game-changing for our business!",
    author: {
      name: "Marcus Johnson",
      role: "Front-end Developer",
      href: "#",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-2.svg",
    },
    image:
      "https://ui.convertfa.st/images/convertfast-ui-light-demo.png",
  },
  {
    title: "Improve your customer experience",
    date: "Feb 12, 2020",
    category: "Business",
    href: "#",
    description:
      "I was skeptical about AI tools, but this platform changed my mind. The natural language processing capabilities are remarkable. It's like having a brilliant assistant always at your fingertips.",
    author: {
      name: "Sarah Thompson",
      role: "Director of Product",
      href: "#",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-3.svg",
    },
    image:
      "https://ui.convertfa.st/images/graphic-walker-dark-2.png",
  },
];

export function BlogSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-4xl sm:text-5xl font-bold leading-7 text-primary">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground sm:text-center">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="flex flex-col bg-card text-card-foreground shadow-none h-full"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="h-64 w-full object-cover rounded-lg border"
              />
              <div className="flex flex-col flex-1 my-8">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={blog.date} className="text-foreground">
                    {blog.date}
                  </time>
                  <Badge variant="secondary">
                    <a href={blog.category}>{blog.category}</a>
                  </Badge>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 line-clamp-1 text-lg/6 font-semibold group-hover:text-muted-foreground">
                    <a href={blog.href}>
                      <span className="absolute inset-0" />
                      {blog.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-muted-foreground">
                    {blog.description}
                  </p>
                </div>
              </div>
              <div className="relative mt-6 flex items-center gap-x-4">
                <Avatar>
                  <AvatarImage
                    alt={blog.author.name}
                    src={blog.author.imageUrl}
                  />
                  <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm/6">
                  <p className="font-semibold">
                    <a href={blog.author.href}>
                      <span className="absolute inset-0" />
                      {blog.author.name}
                    </a>
                  </p>
                  <p className="text-zinc-600">{blog.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}