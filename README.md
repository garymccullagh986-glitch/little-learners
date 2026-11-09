# Little Learners: Evie & Colbie's Learning Journal

A phone app (PWA) for home education: daily plan, weekly kit checklist, printable sheets, and a shared photo journal for two parents. Same stack as your recipe book and GardenAI apps: GitHub Pages + Firebase + Google sign-in.

It runs straight away in **preview mode** (saves on that one device only) until you add your Firebase details.

## Quickest setup (reuse your existing Firebase project)

Because you already have Firebase + Google sign-in working for the recipe app, you can reuse that project. Your GitHub Pages domain is already an authorised sign-in domain.

1. **Config:** open `config.js` and paste in the same `firebaseConfig` values the recipe app uses (apiKey, authDomain, projectId, appId).
2. **Rules:** in Firebase console > Firestore > Rules, **add** the four `match` blocks from `firestore.rules` (`ll_entries`, `ll_checks`, `ll_settings`, `ll_weeks`) and the `isFamily()` function to your existing rules. Replace the two email placeholders with yours and your partner's Google emails (lower case). Don't delete your existing recipe/garden rules. Click Publish.
3. **Upload:** create a new GitHub repo (e.g. `little-learners`), upload all the files in this folder (keep the `icons` folder), then Settings > Pages > deploy from `main` branch, root.
4. **Install:** open `https://YOUR-USERNAME.github.io/little-learners/` on each phone and sign in with Google.
   - iPhone: Safari > Share > Add to Home Screen
   - Android: Chrome menu > Install app

## Signing in

Two ways, both work together: **Google**, or **email and password** (Create account on the login screen). Email accounts must verify their email via a link before the app opens. Both parents' emails still have to be in the `isFamily()` list in the rules, and any email provider works. In Firebase, Authentication > Sign-in method needs Google and/or Email/Password enabled.

## Fresh Firebase project instead

1. console.firebase.google.com > Add project (the free Spark plan is fine).
2. Build > Authentication > Get started > enable **Google**.
3. Build > Firestore Database > Create (production mode, pick `europe-west2` London).
4. Firestore > Rules: paste the contents of `firestore.rules`, put in both emails, Publish.
5. Project settings > Your apps > Web (</>) > copy the config into `config.js`.
6. Authentication > Settings > Authorised domains: add `YOUR-USERNAME.github.io`.
7. Upload to GitHub Pages and install as above.

## How it works

- **Today**: today's activities. Three core ones, plus a folded "more ideas if you fancy it" list. Tap the circle for done, or ⋯ for *did something else* (with a note) or *skip*. Nothing is ever "overdue" and there is no score.
- **Swap**: 🔄 on any activity opens the library (7 themes plus every built-in activity) to swap in something else. "Back to original" undoes it.
- **Follow a new interest**: pick Space, Dinosaurs, Ocean, Minibeasts, Vehicles, Fairy Tales or Winter & Christmas to build a themed week (3 activities a day plus a Friday outing). Start it now or add it to the plan. Delete it later if you like.
- **Plan**: every week, every day, with a "For Colbie" version of each activity.
- **Checklist**: this week's kit and next week's, ticked together and synced. Add your own items.
- **Journal**: entries for Evie, Colbie or both, with photos, reactions and favourites. Tag the skills you noticed (communication, early literacy, numeracy, physical, independence, creativity). Filter to one girl to see her gentle skills card, then tap a skill to see those moments. Counts only, no levels, no comparison.
- **Ages**: enter each girl's birth month in More. Ages then show on Today and on every journal entry and memory-book page (worked out from the entry date, so old entries update too). Swap suggestions sort by what suits Evie's age. Activities default to ages 4 to 6; for older content, give an activity `ages: [min, max]` in `library.js` or `plan.js` and it will be filtered automatically. Birth months are stored in Firestore (`ll_settings`), not in the code.
- **More**: print plans, checklists, outing bingo, a reading log, a tally chart and a **Memory book**. JSON backup and the "Home education in England" guide.
- Works offline (woods, farms). Entries and photos sync when you're back on signal.

## Notes

- Photos are shrunk to about 1000px and saved inside Firestore, so no paid Storage plan is needed. Up to 5 per entry. The free tier holds thousands.
- Access is locked to the two emails in the rules. Anyone else who signs in sees a "not on the family list" screen and can't read anything.
- Themed weeks live in Firestore (`ll_weeks`); new themes or activities are added in `library.js`. The four starter weeks are in `plan.js`.
- If you update files on GitHub and the phone still shows the old version, close and reopen the app once.
- The England legal text was checked on 3 Nov 2026. The "Children Not in School" register is law but not yet in force, so recheck GOV.UK before September 2027.
