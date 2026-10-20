# CC0015 Prototype

Fit2Join is a clickable prototype for young adults with type 1 diabetes (T1D) who are fit and manage their condition well, but get excluded from organised physical activities because of their diagnosis. It combines:

- a glucose sensor with an LED that shows the wearer's status at a glance
- a phone and smartwatch app with alerts for low glucose and missed insulin doses
- a doctor-signed digital certificate, valid for 12 months, listing the activities the person is cleared for
- an organiser dashboard with live readings, emergency steps and short-term, auto-deleting access

Built for the CC0015 group project, using the persona "Rain".

> This is a prototype. All people, clinics and readings are fictional sample data, and nothing in it is medical advice.

**Live demo:** `https://<your-username>.github.io/<repo-name>/` (replace with your link after setup)

---

## Put it on GitHub Pages

You only need a free GitHub account; no coding tools are required.

1. Sign in at [github.com](https://github.com) and click **New repository**.
2. Name it, for example `fit2join`, set it to **Public**, and click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Drag in all five files from this folder: `index.html`, `styles.css`, `app.js`, `favicon.svg` and `README.md`. Click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the **main** branch and the **/ (root)** folder, then click **Save**.
6. Wait a minute or two and refresh. Your link appears at the top of the Pages settings, in the form `https://<your-username>.github.io/fit2join/`.

To update the site later, upload the changed file again with the same name. GitHub Pages republishes automatically.

## How to present it

The site has four tabs: **Rain's app**, **Doctor**, **Organiser** and **Watch & sensor**. Press **P** (or click **Presenter**) to open the presenter controls.

| Key | Scenario | What the audience sees |
| --- | --- | --- |
| 1 | In range | Green LED, steady readings |
| 2 | Dropping fast | Amber warning on Rain's phone, low predicted |
| 3 | Low | Red LED, alerts on phone, watch and organiser dashboard |
| 4 | Urgent low | Flashing red, the watch shakes |
| 5 | High | Amber LED |
| 6 | Missed insulin | Purple LED, prompt to log a dose |
| 7 | Treated, recovering | Glucose climbs back into range |

The panel also has:

- **Rain's phone has internet**: untick it to show that alerts still reach the watch and buddy over Bluetooth, while organiser alerts wait until signal returns.
- **Skip ahead**: jumps to a signed and shared certificate.
- **Reset the demo**: starts again from the beginning.

### Suggested demo order (3 to 4 minutes)

1. **Rain's app → Certificate**: send the activity plan to the doctor.
2. **Doctor**: open the email, use the saved signature, sign and issue the certificate.
3. **Rain's app → Certificate**: share it with the Mt Ophir School Hike.
4. Press **2**, then **3**: show the alert on Rain's phone, the **Organiser** dashboard and the **Watch**. On the Organiser tab, click **Mark: 15 g sugar given**.
5. Press **6**: the LED turns purple. Log a dose on Rain's **Insulin** screen to clear it.
6. Untick **Rain's phone has internet** to show the no-signal case, then tick it again.
7. **Nurse** screen: tap send to play the scripted chat. Finish on the organiser's **Short-term access** box.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure: top bar, tabs and presenter panel |
| `styles.css` | All styling (dark plum glass theme, LED colours) |
| `app.js` | Demo logic: simulated glucose, alerts, certificate flow, chat script |
| `favicon.svg` | Browser tab icon |

To change names, the event or the chat script, edit the constants near the top of `app.js` (`DOCTOR`, `ORG`, `EVENT`, `BUDDY`, `SCRIPT`).

Progress such as a signed certificate is saved in your own browser only. **Reset the demo** clears it.
