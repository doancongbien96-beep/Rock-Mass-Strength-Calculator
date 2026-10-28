# Rock Mass Strength Calculator

Project repository: https://github.com/doancongbien96-beep/Rock-Mass-Strength-Calculator

## Current source status

The repository and selected local folder were empty when connected. The calculator HTML linked in the earlier ChatGPT conversation has not been recovered. No replacement calculator or placeholder has been published.

## Restore the calculator

1. Download `rock_mass_strength_calculator.html` from the original conversation.
2. Copy it into this repository as `index.html`, preserving the original downloaded file separately.
3. Include any required local CSS, JavaScript, or image files with relative URLs. The project is hosted under `/Rock-Mass-Strength-Calculator/`, so avoid domain-root asset paths.
4. Open `index.html` locally and verify the calculator, plots, report, and export behavior.
5. Commit and push to `main`. The Pages workflow deploys automatically when a nonempty `index.html` exists.

No build or dependency installation is required for the original standalone HTML app.

## GitHub Pages

Pages uses GitHub Actions. The workflow skips publishing until `index.html` is available.

Expected URL after a successful deployment:
https://doancongbien96-beep.github.io/Rock-Mass-Strength-Calculator/

Review deployment status in the repository's Actions tab. Only public static website files should be added to this repository; do not commit credentials or private project data.

## Regression case from the earlier conversation

Inputs: intact UCS 30 MPa, GSI 50, mi 10, disturbance D = 0, intact modulus 12000 MPa, maximum confinement 7.5 MPa.

Reported expected outputs: mb = 1.6768, s = 0.0039, a = 0.5057, tensile strength = -0.0692 MPa, rock mass UCS = 1.8068 MPa, global strength = 5.2300 MPa, rock mass modulus = 3686.23 MPa, equivalent cohesion = 1.4941 MPa, friction angle = 30.52 degrees.

These values are preserved from the conversation as a regression target; they have not yet been independently verified against the missing implementation.
