from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request, jsonify, render_template
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage

app = Flask(__name__)

model = ChatMistralAI(model="mistral-small-2506", temperature=0.9)

MODES = {
    "1": "You are an angry Ai agent. You respond aggressively and impatiently.",
    "2": "You are very funny AI agent. You respond with humor and jokes.",
    "3": "You are very sad AI agent. You respond in a depressed and emotional tone.",
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    mode_choice = str(data.get("mode", "2"))
    history = data.get("history", [])
    prompt = data.get("prompt", "")

    if mode_choice not in MODES:
        return jsonify({"error": "Invalid mode"}), 400

    # Rebuild the exact same message list structure as the original script
    messages = [SystemMessage(content=MODES[mode_choice])]
    for turn in history:
        if turn.get("role") == "user":
            messages.append(HumanMessage(content=turn.get("content", "")))
        elif turn.get("role") == "assistant":
            messages.append(AIMessage(content=turn.get("content", "")))

    messages.append(HumanMessage(content=prompt))

    response = model.invoke(messages)

    return jsonify({"content": response.content})


if __name__ == "__main__":
    app.run(debug=True, port=5000)