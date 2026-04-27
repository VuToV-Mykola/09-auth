/** @type {import('stylelint').Config} */
module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": null,
    "length-zero-no-unit": null,
  },
  overrides: [
    {
      files: ["**/*.module.css"],
      rules: {
        "selector-class-pattern": null,
        "length-zero-no-unit": null,
        "alpha-value-notation": null,
        "block-no-empty": null,
        "color-function-alias-notation": null,
        "color-function-notation": null,
        "color-hex-length": null,
        "custom-property-empty-line-before": null,
        "declaration-block-no-duplicate-properties": null,
        "media-feature-range-notation": null,
        "no-descending-specificity": null,
        "rule-empty-line-before": null,
        "shorthand-property-no-redundant-values": null,
      },
    },
  ],
};
