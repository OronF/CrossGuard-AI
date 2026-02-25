import discord
import asyncio
import time
import aiohttp
import os
from datetime import timezone
from dotenv import load_dotenv

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")
API_URL = os.getenv("API_URL")

intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)

queue = asyncio.Queue()
best_time = float("inf")
total_time = 0.0
count = 0

semaphore = asyncio.Semaphore(20)
http_session: aiohttp.ClientSession | None = None


@client.event
async def on_ready():
    global http_session
    http_session = aiohttp.ClientSession()
    print(f"Logged in as {client.user}")
    client.loop.create_task(worker())


@client.event
async def on_message(message):
    if message.author.bot:
        return

    # metadata extraction (fast, non-blocking)
    metadata = {
        "content": message.content,
        "sender_id": str(message.author.id),
        "chat_id": str(message.channel.id),
        "date": message.created_at.replace(tzinfo=timezone.utc).isoformat(),
        "platform": "discord"
    }

    recv = time.perf_counter()
    sent_ts = message.created_at.replace(tzinfo=timezone.utc).timestamp()
    approx_delay = time.time() - sent_ts

    # enqueue message for worker
    await queue.put((message, metadata, recv, approx_delay))

    # stats command
    if message.content == "!stats":
        if count > 0:
            avg = total_time / count
            await message.channel.send(
                f"Best Response Time: {best_time*1000:.2f} ms\n"
                f"Average Response Time: {avg*1000:.2f} ms"
            )
        else:
            await message.channel.send("No deletes recorded yet.")


async def worker():
    while True:
        message, metadata, recv, approx_delay = await queue.get()
        # schedule a task for each message
        asyncio.create_task(handle_message(message, metadata, recv, approx_delay))
        queue.task_done()


async def handle_message(message, metadata, recv, approx_delay):
    global best_time, total_time, count

    if http_session is None:
        return

    async with semaphore:  # limit concurrency
        try:
            timeout = aiohttp.ClientTimeout(total=0.5)
            async with http_session.post(
                    API_URL,
                    json=metadata,
                    headers={"Authorization": f"Bearer {API_TOKEN}"},
                    timeout=timeout
            ) as resp:

                if resp.status != 200:
                    return

                data = await resp.json()
                if not data.get("delete"):
                    return

                await message.delete()

                elapsed = time.perf_counter() - recv
                total_time += elapsed
                count += 1
                best_time = min(best_time, elapsed)

                print(
                    f"Send→Receive ≈ {approx_delay*1000:.1f} ms | "
                    f"Receive→Delete = {elapsed*1000:.1f} ms"
                )

        except discord.Forbidden:
            print("Missing permissions to delete message.")
        except discord.HTTPException:
            print("Discord API error.")
        except Exception as e:
            print("Worker error:", e)


@client.event
async def on_close():
    if http_session:
        await http_session.close()


client.run(os.getenv("DISCORD_TOKEN"))