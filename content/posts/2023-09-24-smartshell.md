---
title: "ChatGPT-integrated Smartshell"
date: 2023-09-24T21:28:00-05:00
tags: ["builds"]
draft: false
---

I recently started playing with the idea of a "smart" command-line shell integrated with ChatGPT and implemented in Python. The code for my rudimentary implementation is freely available [here](https://github.com/nik875/intellishell), and should be simple enough to install and run on a Linux system.

**IntelliShell Update 10/9/2023:**

I've changed a lot of things about the smartshell from the original article. It now operates as an oh-my-zsh plugin instead of a standalone Python program. I gave it a proper name: IntelliShell. And I created a proper frontend-backend system with a web server to allow anyone to use it with minimal setup. From interviews I've done with potential users, I decided to target it towards academic researchers transitioning to the computational sciences.

If you want to set this up and try it out yourself, contact me for an API key. I'd be happy to guide you through the installation and offer support, too. I'm still trying to evaluate the commercial viability of this system, so consider it a pro bono service for now.

![](/assets/2023-10-09-smartshell-assets/intellishell-demo.png){:class="img-responsive"}
*Visual demo of IntelliShell's current capabilities.*

---

### The Problems I'm Trying to Solve

Have you ever had the experience of opening the command line and knowing what you *want* to do, but no idea what words to type to make it happen? Have you ever copy-pasted in a random command from some forum post made 15 years ago, with no clue what it does and blind hope that it'll fix your problem? Have you ever wished you could talk to ChatGPT right from your command line, without the gargantuan effort required to type the URL into your search bar first?

No? Well too bad, because I solved all those problems anyway!

### My Solution

The idea is simple: a dual-function command line shell with ChatGPT integration at every level. The user will be prompted to enter either an attempted shell command or a natural language chat message. ChatGPT will classify the input as either an attempted shell command or a natural language message. If it's an attempted command, it'll validate whether it's likely to work and do what the user intended, and assess whether there's any risk to running the command. If it's safe/reasonable/likely to work, the command will be executed and the result will be printed to the user. If ChatGPT is worried, its concerns will be printed to the user and the user will be given the opportunity to either back out or run the command anyway (smartass...).

Oh, and if the user had entered a natural language chat message initially, it'll pass to an assistant chatbot who can answer questions, provide examples, and do all the other wonderful things that ChatGPT can do. That's right, no more reading ridiculously long manpages to find that one tiny nugget of information you need to verify that your code won't have a seizure when you run it. Just ask your question in the command line, in natural language, and receive a quick and concise response from ChatGPT.

### The Implementation

All of this is implemented, of course, with the OpenAI API, and you'll have to create a creds.py file with an API key. You'll also have to add some credits to your OpenAI platform account (their rules, not mine) to actually make any calls. But since I am a broke college student, I made sure that the system worked perfectly on GPT-3.5 Turbo, so trying it out shouldn't punch a massive hole in your wallet.

I also have to mention the massive contributions of the team working on [guidance](https://github.com/guidance-ai/guidance). I have no idea what kind of sorcery they've conjured up, but somehow they've solved one of the biggest problems with LLMs: inconsistency and unreliable output structure. They also designed this thing called "guidance acceleration" which is about the only thing keeping my shell response times on the very edge of what I consider to be useable. It's all pretty well documented on their README, so I strongly encourage checking that out. In fact, if you're interested at all in developing real apps with LLMs and extracting the intelligence out of these models, I *strongly* recommend checking out this project.

That said, there is this one [incredibly pesky bug](https://github.com/guidance-ai/guidance/issues/338) which caused me a great deal of suffering, but was simple enough to work around once I knew what was happening. Maybe fixing this will be my next project...

I also implemented an autonomous agent from scratch using guidance which is *on paper* able to complete complex tasks for you straight from the command line. In reality it can't really handle even the most basic tasks yet, and was more of a practice project for me to learn how to use guidance and how autonomous agents work under the hood than an actual functional feature of the shell. Though obviously in the future, a feature like this would be really really cool (imagine being able to just say "Make me a tutorial course to explain to a room full of engineers how git's CLI works" and having it done for you!). To use the agent, just prefix your request with "AGENT: ", and enter what you want to have done. Then just sit back, relax, and watch it crash and burn.

The agent's architecture was heavily inspired by [this paper](https://arxiv.org/pdf/2308.11432.pdf), which I also really recommend checking out if you're at all interested in the inner workings of systems like AutoGPT.

### The Result

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/xlufPt5SHMQ?si=yFOrVyUKiyKZ3oYK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Cool, right? Building that cost me a lot of hours and a whole letter grade on my Architecture exam. I really, really hate that class.

I think people who are less familiar with the command line might actually be willing to pay the API fees for this, so that they can feel safer, more confident, and learn the things they need to know more easily. Maybe I could make a business out of this...

### Final Thoughts

LLMs are somehow both the coolest and the most frustrating pieces of software that I've had the pleasure of working with. Once you figure out how to unlock and fully leverage their intelligence and cut out the inconsistency, hallucinations, and confusion, you can build very smart tools with very little time and effort.

Yeah, that's all. Mission accomplished. I'm going to bed.
