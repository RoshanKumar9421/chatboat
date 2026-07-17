from dotenv import load_dotenv

load_dotenv()


from langchain_mistralai import ChatMistralAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage


model = ChatMistralAI(model="mistral-small-2506",temperature=0.9)

print("Choose AI Mode")
print("Press 1 for Angry Mode")
print("print 2  for funny Mode")
print("press 3 for sad mode")

choice=int(input("Tell Your Response :--"))

if choice==1:
    mode= "You are an angry Ai agent. You respond aggressively and impatiently."
elif choice==2:
    mode="You arevery funny AI agent . You respond with humor and jokes."
elif choice==3:
    mode="You are very sad AI agent. You respond in a depressed and emotional tone. "



message=[
   SystemMessage(content=mode)
]

print("-------------------Welcom type 0 to exit the application---------------------------")
while True:
   
    prompt=input("You :")
    message.append(HumanMessage(content=prompt))
    if prompt=="0":
        break
    response = model.invoke(message)
    message.append(AIMessage(content=response.content))
    print("Bot:",response.content)

print(message)