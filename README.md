# Rock Mass Strength Calculator

Independent Generalized Hoek–Brown engineering workbench, with an original desktop interface informed by public RSData workflow conventions. It uses no Rocscience source code. The GSI dialog displays the two reference screenshots supplied for this project; the live type selector and GSI input apply values to the calculator.

Live site: https://doancongbien96-beep.github.io/Rock-Mass-Strength-Calculator/

Open index.html locally to run the calculator. No build or dependency installation is required.

The toolbar provides reset, print report, Excel export, and JSON project save/open. The left pane contains material inputs and reference pickers for UCS, GSI, mi, disturbance and modulus ratio. The GSI dialog displays the supplied jointed-rock or Flysch reference image based on the selected type, with a separate editable GSI value. Central model tabs explain Generalized Hoek–Brown and equivalent Mohr–Coulomb; both stress charts update with inputs. Toggle either envelope, inspect cursor stress coordinates, wheel to zoom, or double-click / Reset view to restore. The right pane shows calculated properties, and the status bar reports validation errors. All stress and modulus values are in MPa; dimensions are in m and unit weight in MN/m³.

General, Tunnel, Slope and Custom applications retain the original failure-range calculations. Invalid or incomplete inputs keep the previous valid results and show a status message. Reference picker values are preliminary guidance; determine GSI from site mapping and project data.

## Verification

Run `node verify.cjs` from the repository root. The dependency-free regression compares 108 cases against the retained pre-redesign implementation in `tests/baseline.html`, covering all application and modulus methods with varied GSI and D. This verifies preservation of the existing equations, rather than constituting independent engineering certification.

Default benchmark: σci=30 MPa, GSI=50, mi=10, D=0, Ei=12000 MPa and σ3max=7.5 MPa yields mb=1.6767724875, s=0.0038659201, a=0.5057335599, c′=1.4941390871 MPa, φ′=30.5151229149° and Erm=3686.2308166 MPa.

Public UX references: [RSData Properties Pane](https://www.rocscience.com/help/rsdata/documentation/general-features-2/properties-pane) and [Failure Range](https://www.rocscience.com/help/rsdata/documentation/materials/failure-range). Equation references: Hoek, Carranza-Torres & Corkum (2002), and Hoek & Diederichs (2006).

GitHub Pages publishes the root of the main branch. The .nojekyll file enables direct static hosting.
