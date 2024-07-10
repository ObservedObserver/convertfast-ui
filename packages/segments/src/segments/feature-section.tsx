import { Button } from "@/components/ui/button";
import { FC } from "react";

export const FeatureSection: FC = () => {
  return (
    <div className="p-16 mx-auto">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-primary">
          Convert fast
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to build landing pages.
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Quis tellus eget adipiscing convallis sit sit eget aliquet quis.
          Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.
          In mi viverra elit nunc.
        </p>
      </div>
      <div className="grid grid-cols-3 mt-8">
        <div>
          <div>Build landing page within seconds</div>
          <p>
            ands nc snma cdn an dnmc nmsa dm cmand m san dmc amnsd cman cdmans
            dmaa
          </p>
          <div>
            <Button variant="link">Learn more</Button>
          </div>
        </div>
        <div>
          <div>Build landing page within seconds</div>
          <p>
            ands nc snma cdn an dnmc nmsa dm cmand m san dmc amnsd cman cdmans
            dmaa
          </p>
          <div>
            <Button variant="link">Learn more</Button>
          </div>
        </div>
        <div>
          <div>Build landing page within seconds</div>
          <p>
            ands nc snma cdn an dnmc nmsa dm cmand m san dmc amnsd cman cdmans
            dmaa
          </p>
          <div>
            <Button variant="link">Learn more</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
