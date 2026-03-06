from datetime import datetime
from MLE.Inference.Predictions import spam_probability, spam_probability_batch

"""
msg1 = "Congratulations! You won a $500 Amazon gift card"
msg2 = "Can we reschedule our meeting?"
msg3 = "this is the best place to get free money"
msg4 = "i dont mind it"
msg5 = "dont do this"
msg6 = "im happy to say you are one of the luckiest person i know click here to get your price"

now = datetime.now()

print("Message:", msg1)
print("Spam probability:", spam_probability(msg1))   # 0.0 - 1.0

end = datetime.now()

print("this is the time it took the machine to classify one message")
print(end - now)

print("Message:", msg2)
print("Spam probability:", spam_probability(msg2))

print("Message:", msg3)
print("Spam probability:", spam_probability(msg3))

print("Message:", msg4)
print("Spam probability:", spam_probability(msg4))

print("Message:", msg5)
print("Spam probability:", spam_probability(msg5))

print("Message:", msg6)
print("Spam probability:", spam_probability(msg6))
# 0.0 - 1.0



# Single message
"""
now = datetime.now()
msg1 = "Congratulations! You won $500 Amazon gift card"
print("Message:", msg1)
print("Spam probability:", spam_probability(msg1))
end = datetime.now()

print("single message time")
print(end - now)

# Batch of messages
msgs = [
    "Congratulations! You won a $500 Amazon gift card",
    "Can we reschedule our meeting?",
    "this is the best place to get free money",
    "i dont mind it",
    "dont do this",
    "im happy to say you are one of the luckiest person i know click here to get your price"
]
now = datetime.now()
probs = spam_probability_batch(msgs)
for m, p in zip(msgs, probs):
    print(f"Message: {m} -> Spam probability: {p}")
end = datetime.now()

print("many message time")
print(end - now)
