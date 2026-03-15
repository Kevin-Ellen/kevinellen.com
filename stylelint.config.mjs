export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "selector-class-pattern": [
      "^(?:l|c|m|u|is|has)-[a-z0-9]+(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$",
      {
        message:
          "Expected class names to use project prefixes (l-, c-, m-, u-, is-, has-) with optional BEM __element and --modifier.",
      },
    ],
    "no-descending-specificity": null,
    "scss/dollar-variable-empty-line-before": null,
    "scss/dollar-variable-colon-space-after": null,
  },
};
