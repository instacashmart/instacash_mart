# InstaCashMart

React source for the InstaCashMart website, built with Vite, React 18 and React Router 6.

## Run it

Requires Node.js 18 or later.

Create a `.env` file in the project root with the Firebase settings below before
starting the app or building it. The Firebase web configuration is included in
the client bundle; configure Firebase security rules and API key restrictions in
the Firebase console.

```dotenv
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_ADMIN_UID=your-admin-authentication-uid
```

Enable **Email/Password** in Firebase Authentication for the admin and **Google**
sign-in for customers. Add your deployed website domain under Firebase
Authentication's authorized domains. Ensure the admin account has the UID
configured above. Publish the project `firestore.rules` in the
Firebase Console. Website records are stored in Firestore; profile details remain
local to the visitor's device.

To publish the Firestore rules and indexes with the Firebase CLI, run
`firebase deploy --only firestore --project instamart1-7a090` from this
directory. Public forms can create orders, enquiries, feedback and reviews;
personal order details are admin-only. Customers can look up an order using its
random reference code, which returns only the non-sensitive tracking details.

```bash
npm install
npm run dev       # development server with hot reload
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

Deploy by uploading the contents of `dist/` to any static host. The site uses hash URLs
(`/#/profile`), so no server rewrite rules are needed.

## Where things are

| Path | Contents |
| --- | --- |
| `src/App.jsx` | All routes and page titles |
| `src/pages/` | One file per page, with `sell/`, `vehicles/` and `admin/` groups |
| `src/components/layout/` | Header, footer, drawer, bottom nav, intro animation |
| `src/components/ui/` | Shared pieces such as `Modal`, `Accordion`, `Breadcrumbs` |
| `src/data/` | Device catalog, prices, brands, vehicles, site content |
| `src/lib/store.js` | Firestore-backed collections with a local cache |
| `src/lib/firebase.js` | Firebase app, Authentication, Firestore and Analytics |
| `src/context/AppContext.jsx` | Shared app state: toast, city, modals, store search |
| `src/assets/` | Images. `assets/models/` is loaded by filename, so adding `pixel-12.webp` gives the model "Pixel 12" its photo |
| `src/styles/` | `app.css` (site styles) and `vendor.css` (Font Awesome, fonts) |

## Things to know

- **Firestore data.** Orders, enquiries, feedback, reviews and admin-managed catalog data
  are stored in Firestore. Customers sign in with Google before confirming a device
  pickup; their pickup records are readable by that signed-in account and admins.
  Profile contact details remain in that visitor's browser.
- **Admin sign-in.** `/admin` requires Firebase Email/Password sign-in with the configured
  admin UID. Firestore rules independently enforce admin access to private data.
- **Local data migration.** On the first admin sign-in in a browser, locally saved collection
  data is copied to Firestore only when that Firestore collection is empty.
- **Styling is precompiled.** `src/styles/app.css` is the compiled Tailwind output, so only
  classes already used on the site exist. A new class such as `mt-7` has no effect unless
  it is already in that file. Add new styles to `app.css`, or install Tailwind and
  recreate its theme (the `brand` and `dark` colors).
- **Some short variable names remain.** This code was rebuilt from a compiled site, so
  some local variables inside functions have short or generic names (`y`, `flag`). Rename
  them as you work in a file.
