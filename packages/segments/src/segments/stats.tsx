const stats = [
    { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
    { id: 2, name: 'Assets under holding', value: '$119 trillion' },
    { id: 3, name: 'New users annually', value: '46,000' },
  ]
  
export function Stats() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-primary">
          Trusted by creators worldwide
        </h2>
        <p className="mt-4 text-base tracking-tight text-muted-foreground">
          Lorem ipsum dolor sit amet consect adipisicing possimus.
        </p>
      </div>
      <div className="mt-24 mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-muted-foreground">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-primay sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}