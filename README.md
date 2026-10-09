# Mycenaean Seal Archive

Θέλω να δημιουργήσεις μια κεντρική πλατφόρμα (Master Exhibition Portal & Aggregator) για ένα ψηφιακό μουσείο Μυκηναϊκών Σφραγιδόλιθων.

1. Φόρτωση & Σύνθεση Δεδομένων (Data Aggregation):

Η εφαρμογή πρέπει να διαβάζει ένα κεντρικό αρχείο manifest.json (π.χ. από ένα GitHub Raw URL ή ένα τοπικό /public/manifest.json).

Το manifest.json περιέχει έναν πίνακα από αντικείμενα με τη μορφή:
[{ "student": "Όνομα", "appUrl": "https://...", "dataApi": "https://.../data.json" }]

Η εφαρμογή θα εκτελεί fetch() σε όλα τα dataApi URLs παράλληλα (Promise.allSettled).

Όλα τα εκθέματα (exhibits) από όλα τα JSONs θα συνενώνονται σε μία κεντρική συλλογή, διατηρώντας για κάθε έκθεμα την πληροφορία του δημιουργού/φοιτητή (studentName, appTitle, appUrl).

2. Διεπαφή Χρήστη & Λειτουργικότητες (UI/UX Features):

Hero Section / Εισαγωγή: Τίτλος "Συλλογικό Ψηφιακό Μουσείο Μυκηναϊκών Σφραγιδόλιθων", με στατιστικά σε πραγματικό χρόνο (π.χ. "Χ Συλλογές | Υ Συνολικά Εκθέματα | Z Δημιουργοί").

Πλέγμα Εκθεμάτων (Master Gallery Grid):

Κάθε κάρτα εκθέματος εμφανίζει:

Την εικόνα (με διακόπτη/tabs για εναλλαγή ανάμεσα σε Original, AI Photorealistic, AI Living Scene).

Τον τίτλο, το υλικό, την περίοδο και την προέλευση.

Badge Δημιουργού: Badge με το όνομα του φοιτητή και κουμπί "Δες την ατομική εμπειρία ↗" που ανοίγει το appUrl του φοιτητή σε νέο tab.

Φίλτρα & Αναζήτηση (Global Search & Filtering):

Αναζήτηση με κείμενο (Search Bar) σε τίτλο, περιγραφή και υλικό.

Φιλτράρισμα ανά Δημιουργό/Φοιτητή (Dropdown selector).

Φιλτράρισμα ανά Υλικό (π.χ. Ίασπις, Σάρδιος, Στεατίτης) και Προέλευση (π.χ. Μυκήνες, Πύλος).

Modal Προβολής Εκθέματος (Detailed View):

Πατώντας σε μια κάρτα, ανοίγει αναλυτικό modal με:

Μεγάλη προβολή και των 3 εικόνων δίπλα-δίπλα ή με slider σύγκρισης (Image Comparison / Before-After).

Πλήρη αρχαιολογική περιγραφή και σύνδεσμο προς την πρωτογενή πηγή CMS/Arachne (sourceUrl).

Πληροφορίες για το concept της εφαρμογής του φοιτητή (appDescription, conceptType).

3. Διαχείριση Σφαλμάτων & UX:

Αν κάποιο dataApi ενός φοιτητή αποτύχει (π.χ. due to network error ή CORS), η εφαρμογή δεν πρέπει να κρασάρει, αλλά να εμφανίζει τα υπόλοιπα εκθέματα κανονικά, δείχνοντας ένα διακριτικό warning notification στο footer.

Χρησιμοποίησε ένα σύγχρονο, ατμοσφαιρικό dark museum theme (με τόνους του σχιστόλιθου, θερμά χρυσά/χάλκινα accents και καθαρή τυπογραφία).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dmc-seals.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/94b927fa-2460-4c78-b7bc-129cd5b50409).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
