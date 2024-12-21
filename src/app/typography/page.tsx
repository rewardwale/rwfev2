import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

export default function typography() {
  return (
    <div className="h-screen">
      <div className="font-black">
        Testing typography with the chosen font - NOTOSANS
        <br />
        Check weights and Italics - compare
        <div className="flex gap-4">
          <ThemeColorToggle />
          <ThemeModeToggle />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex justify-center py-10 gap-10">
          <br />
          <br />
          <div className="text-primary">
            <h1>NotoSans</h1>
            <div className="font-extrabold">
              Home is the best place on earth
            </div>
            <div className="font-bold">Home is the best place on earth</div>
            <div className="font-semibold">Home is the best place on earth</div>
            <div className="font-medium">Home is the best place on earth</div>
            <div className="font-normal">Home is the best place on earth</div>
            <div className="font-light">Home is the best place on earth</div>
            <div className="font-extralight">
              Home is the best place on earth
            </div>
            <div className="font-thin">Home is the best place on earth</div>
            <br />
            <br />
            <h2>NotoSans Italic</h2>
            <div className="font-extrabold italic">
              Home is the best place on earth
            </div>
            <div className="font-bold italic">
              Home is the best place on earth
            </div>
            <div className="font-semibold italic">
              Home is the best place on earth
            </div>
            <div className="font-medium italic">
              Home is the best place on earth
            </div>
            <div className="font-normal italic">
              Home is the best place on earth
            </div>
            <div className="font-light italic">
              Home is the best place on earth
            </div>
            <div className="font-extralight italic">
              Home is the best place on earth
            </div>
            <div className="font-thin italic">
              Home is the best place on earth
            </div>
          </div>
          <div className="text-muted-foreground font-NotoSerif">
            Serif
            <div className="font-extrabold">
              Home is the best place on earth
            </div>
            <div className="font-bold">Home is the best place on earth</div>
            <div className="font-semibold">Home is the best place on earth</div>
            <div className="font-medium">Home is the best place on earth </div>
            <div className="font-normal">Home is the best place on earth</div>
            <div className="font-light">Home is the best place on earth</div>
            <div className="font-extralight">
              Home is the best place on earth
            </div>
            <div className="font-thin">Home is the best place on earth</div>
            <br />
            <br />
            <br />
            <div className="font-extrabold italic">
              Home is the best place on earth
            </div>
            <div className="font-bold italic">
              Home is the best place on earth
            </div>
            <div className="font-semibold italic">
              Home is the best place on earth
            </div>
            <div className="font-medium italic">
              Home is the best place on earth
            </div>
            <div className="font-normal italic">
              Home is the best place on earth
            </div>
            <div className="font-light italic">
              Home is the best place on earth
            </div>
            <div className="font-extralight italic">
              Home is the best place on earth
            </div>
            <div className="font-thin italic">
              Home is the best place on earth
            </div>
          </div>
        </div>
        <div className="flex justify-center py-10 gap-10">
          <br />
          <br />
          <div className="font-Inter">
            Inter
            <div className="font-extrabold">
              Home is the best place on earth
            </div>
            <div className="font-bold">Home is the best place on earth</div>
            <div className="font-semibold">Home is the best place on earth</div>
            <div className="font-medium">Home is the best place on earth </div>
            <div className="font-normal">Home is the best place on earth</div>
            <div className="font-light">Home is the best place on earth</div>
            <div className="font-extralight">
              Home is the best place on earth
            </div>
            <div className="font-thin">Home is the best place on earth</div>
            <br />
            <br />
            <br />
            <div className="font-extrabold italic">
              Home is the best place on earth
            </div>
            <div className="font-bold italic">
              Home is the best place on earth
            </div>
            <div className="font-semibold italic">
              Home is the best place on earth
            </div>
            <div className="font-medium italic">
              Home is the best place on earth
            </div>
            <div className="font-normal italic">
              Home is the best place on earth
            </div>
            <div className="font-light italic">
              Home is the best place on earth
            </div>
            <div className="font-extralight italic">
              Home is the best place on earth
            </div>
            <div className="font-thin italic">
              Home is the best place on earth
            </div>
          </div>
          <div className="font-Roboto">
            Roboto
            <div className="font-extrabold">
              Home is the best place on earth
            </div>
            <div className="font-bold">Home is the best place on earth</div>
            <div className="font-semibold">Home is the best place on earth</div>
            <div className="font-medium">Home is the best place on earth </div>
            <div className="font-normal">Home is the best place on earth</div>
            <div className="font-light">Home is the best place on earth</div>
            <div className="font-extralight">
              Home is the best place on earth
            </div>
            <div className="font-thin">Home is the best place on earth</div>
            <br />
            <br />
            <br />
            <div className="font-extrabold italic">
              Home is the best place on earth
            </div>
            <div className="font-bold italic">
              Home is the best place on earth
            </div>
            <div className="font-semibold italic">
              Home is the best place on earth
            </div>
            <div className="font-medium italic">
              Home is the best place on earth
            </div>
            <div className="font-normal italic">
              Home is the best place on earth
            </div>
            <div className="font-light italic">
              Home is the best place on earth
            </div>
            <div className="font-extralight italic">
              Home is the best place on earth
            </div>
            <div className="font-thin italic">
              Home is the best place on earth
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-wrap justify-center py-10 gap-10">
        <div className="flex flex-col justify-center font-black">
          Weight 900
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-extrabold">
          Weight 800
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-bold">
          Weight 700
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-semibold">
          Weight 600
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-medium">
          Weight 500
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-normal">
          Weight 400
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-light">
          Weight 300
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-extralight">
          Weight 200
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
        <div className="flex flex-col justify-center font-thin">
          Weight 100
          <div className="font-NotoSerif">Home is the best place on earth</div>
          <div className="">Home is the best place on earth</div>
          <div className="font-Inter">Home is the best place on earth</div>
          <div className="font-Roboto">Home is the best place on earth</div>
        </div>
      </div>
    </div>
  );
}
