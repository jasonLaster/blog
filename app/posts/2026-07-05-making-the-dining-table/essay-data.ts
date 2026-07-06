import type {
  VisualEssayImage,
  VisualEssayStepSummary,
} from "../../components/visual-essay";

export const heroImage: VisualEssayImage = {
  src: "/dining-table/hero.jpg",
  alt: "A finished handmade walnut dining table in a warm dining room",
  caption: "The finished table, a few weeks after the first rough boards came home.",
};

export const processSteps: VisualEssayStepSummary[] = [
  { number: "01", title: "Sketch" },
  { number: "02", title: "Mill" },
  { number: "03", title: "Join" },
  { number: "04", title: "Finish" },
];

export const boardImages: VisualEssayImage[] = [
  {
    src: "/dining-table/02-rough-boards.jpg",
    alt: "A stack of rough walnut boards on a workbench",
  },
  {
    src: "/dining-table/04-table-saw.jpg",
    alt: "A walnut board being ripped on a table saw",
  },
  {
    src: "/dining-table/03-planing.jpg",
    alt: "A walnut board on a jointer with shavings nearby",
  },
  {
    src: "/dining-table/12-grain-closeup.jpg",
    alt: "Close-up of walnut grain",
  },
  {
    src: "/dining-table/01-sketch.jpg",
    alt: "A notebook sketch of the dining table",
  },
  {
    src: "/dining-table/05-joinery-test.jpg",
    alt: "A test-fit walnut joint with a loose tenon",
  },
  {
    src: "/dining-table/06-tenon-layout.jpg",
    alt: "Tenon layout marks on walnut boards",
  },
  {
    src: "/dining-table/07-glue-up.jpg",
    alt: "Walnut tabletop glue-up held with long clamps",
  },
  {
    src: "/dining-table/08-sanding.jpg",
    alt: "A random orbit sander smoothing a walnut tabletop",
  },
  {
    src: "/dining-table/09-edge-detail.jpg",
    alt: "Close-up of an eased walnut tabletop edge",
  },
  {
    src: "/dining-table/10-oil-finish.jpg",
    alt: "Oil finish being wiped onto a walnut tabletop",
  },
  {
    src: "/dining-table/11-base-assembly.jpg",
    alt: "The underside and base assembly of the dining table",
  },
];

export const jointImages: VisualEssayImage[] = [
  {
    src: "/dining-table/05-joinery-test.jpg",
    alt: "A test-fit walnut joint with a loose tenon",
  },
  {
    src: "/dining-table/06-tenon-layout.jpg",
    alt: "Tenon layout marks on walnut boards",
  },
  {
    src: "/dining-table/07-glue-up.jpg",
    alt: "Walnut tabletop glue-up held with long clamps",
  },
  {
    src: "/dining-table/11-base-assembly.jpg",
    alt: "The underside and base assembly of the dining table",
  },
];

export const surfaceImages: VisualEssayImage[] = [
  {
    src: "/dining-table/08-sanding.jpg",
    alt: "A random orbit sander smoothing a walnut tabletop",
  },
  {
    src: "/dining-table/09-edge-detail.jpg",
    alt: "Close-up of an eased walnut tabletop edge",
  },
  {
    src: "/dining-table/10-oil-finish.jpg",
    alt: "Oil finish being wiped onto a walnut tabletop",
  },
  {
    src: "/dining-table/12-grain-closeup.jpg",
    alt: "Finished walnut grain close-up",
  },
];

export const sketchImage: VisualEssayImage = {
  src: "/dining-table/01-sketch.jpg",
  alt: "Notebook sketch of a trestle dining table",
};

export const millingImage: VisualEssayImage = {
  src: "/dining-table/03-planing.jpg",
  alt: "A walnut board being flattened on a jointer",
};

export const joineryImage: VisualEssayImage = {
  src: "/dining-table/06-tenon-layout.jpg",
  alt: "Loose tenon layout marks on a walnut board",
};

export const finishImage: VisualEssayImage = {
  src: "/dining-table/10-oil-finish.jpg",
  alt: "Oil being wiped onto a walnut tabletop",
};
