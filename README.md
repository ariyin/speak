![speak logo](frontend/public/speak-full.svg)

designed to ease public speaking anxiety and boost your confidence. get targeted feedback on how closely your speech matches your prepared outline or script, along with insights on filler words, pacing, and body language.

## setup

### frontend

to run:

```bash
cd frontend
npm run dev
```

create a `.env` file in `/frontend` with the following:

```env
VITE_CLOUD_NAME=
VITE_UPLOAD_PRESET=
```

### backend

to run:

```bash
cd backend
python -m venv venv # create a virtual environment
source venv/bin/activate # on windows: venv\Scripts\activate
pip install --upgrade pip  # make sure pip is up to date
pip install -r requirements.txt
python3 main.py
```

create a `.env` file in `/backend` with the following:

```env
MONGODB_URL=mongodb+srv://<db_username>:<db_password>@cluster0.wddsg5v.mongodb.net/PublicSpeaking?retryWrites=true&w=majority&appName=Cluster0
PORT=8000
```

### analysis

create a `.env` file in `/analysis` with the following:

```env
GEMINI_API_KEY=
```

## usage

### overall flow

1. click "create new speech" in the top-right corner of the page
2. select the type(s) of analysis you'd like — content, delivery, or both
3. upload your your speech video by either selecting a file from your device or recording directly through our platform
4. click "next" to begin the analysis process
5. review your results and choose to either finish the session or rehearse again
6. if you choose to rehearse again, repeat steps 2-5 as needed for additional practice or feedback

### viewing past speeches and rehearsals

1. from the home page, click on an existing speech
2. find and click the specific rehearsal you're looking for
3. view your past analysis
4. go back to all the rehearsals or exit to the home page
