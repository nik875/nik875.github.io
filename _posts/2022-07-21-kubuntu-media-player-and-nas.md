---
layout: post
title: Kubuntu Media Player and NAS
date: 2022-07-21 19:34
---

For well over a year now, I've had my old laptop sitting on my desk, completely unused. It's actually a decently performant [HP Pavilion](https://www.hp.com/us-en/shop/pdp/hp-pavilion-x360-convertible-15t-er000-touch-24d80av-1) with a 4-generations-old i5. The reason I had to let it go and get an upgrade is physical damage to its screen (my own fault, really; I'll never be opening a laptop from its bottom corner again). I was able to keep the screen from falling apart with tape, but the laptop is in no condition to be my daily driver.

Thus it ended up collecting dust on my desk, waiting to be thrown away so that it could join the enormous piles of e-waste currently sitting in landfills or floating in ocean garbage patches. But after successfully converting [this other outdated Lenovo laptop](https://www.instagram.com/p/Ccu1AjnuSHp/) into an encrypted Network-Attached Storage (NAS), I decided to try giving my old laptop a second lease on life.

## Criteria and Constraints

My #1 requirement was that no matter what, the screen could not get more damaged, because that would complicate all future attempts to make something of the laptop. Additionally, I wanted the laptop to serve at least some useful function that would help either me or the others in my home; after all, what good is a working laptop if it's still just going to be sitting on my desk? Lastly, I didn't want to buy anything for this setup, because that would just further contribute to the world's e-waste problem; I would only be able to use stuff that I already had lying around at home.

## The Plan

The most obvious choices to meet these criteria and constraints all involve connecting this laptop to a monitor in order to remove the need for a screen entirely. My family could then use it like a regular desktop PC, or even as a smart home hub that could control my home's other smart devices. The only problem: we don't have an extra monitor lying around. Nor do we have a mouse and keyboard that could make it possible for me to just shut the lid on the laptop permanently to avoid screen damage.

My next thought was to install Ubuntu Server and use it as a NAS, so that I could store data that wouldn't fit on my primary laptop. But I already made one of those in my last conversion, so this would have a very limited benefit (not to mention that it'd be really boring to do the exact same thing twice).

But there was one other option that had some merit—using this laptop as a central controller for our in-home theater. We'd been using an even older laptop running Windows for this purpose, but it had a faulty HDMI connector that would cause occasional video and audio blackouts while watching movies. Not to mention that it was unbearably slow, to the point of scaring us off from trying to watch movies in our theater.

My plan was to replace this older laptop (which may be subject to a future conversion, if I can find something to do with it…) with my more performant HP Pavilion. Despite its screen damage, the Pavilion had an intact HDMI port that made it perfect for streaming to a media room. Plus, I'd be able to use the room's projector like a monitor, meaning that the laptop would still be usable even if the screen completely fell apart. I'd install Kubuntu (an Ubuntu flavor with KDE Plasma desktop) over the laptop's existing Windows installation to ensure smooth operation for years to come, while also maintaining a Windows-like feel for the less technical people in my home. And I'd enable SSH access in order to open the laptop's 256 GB SSD for use over the network, allowing the whole setup to also double as a NAS.

![](/assets/2022-07-21-kubuntu-media-player-and-nas-assets/2022-07-21-20-37-46-image.png){:class="img-responsive"}
*Screenshot of Kubuntu's [KDE Plasma](https://kde.org/announcements/plasma/5/5.24.0/) desktop environment, the look I was hoping to recreate on my HP Pavilion.*

## The Execution

On the whole, this laptop conversion went very smoothly thanks to the Ubuntu installer's automatic driver installation. I overwrote the entire hard disk with Kubuntu as planned, without disk encryption in order to simplify the startup process for non-technical users. This resulted in a whopping 211 GB of free disk space; my first order of business after installation was to enable SSH and set a static IP in order to make that storage accessible over my local network.

![](/assets/2022-07-21-kubuntu-media-player-and-nas-assets/2022-07-21-20-50-33-image.png){:class="img-responsive"}
*Screenshot of my Pavilion's neofetch and free disk space, taken over SSH from my Mac.*

Once I had the network storage down, I moved on to setting up the media room's speakers and projector as output devices. This was way easier than I expected it to be based on experience with Windows' nightmarishly poor customizability; KDE Plasma had settings that did everything I wanted to do, organized in a way that made sense. The last thing I had to do was disable sleeping so that the laptop didn't go offline after being unused for a while, and I was able to log into Netflix and watch [The Sea Beast](https://www.imdb.com/title/tt9288046/) with my family.

## Final Result

![](/assets/2022-07-21-kubuntu-media-player-and-nas-assets/2022-07-21-21-11-42-image.png){:class="img-responsive"}
*Picture of my final setup, with the laptop sitting on top of our amplifier.*

I had to make some compromises with this setup, primarily because we didn't have a free keyboard and mouse lying around that would allow me to shut the lid on this laptop for good. For now, at least, it remains open, though the screen is completely deactivated when the projector is on. Luckily HP had drivers available *somewhere* for all my laptop's hardware (except the touchscreen, though that wasn't really usable anyways given the state of the screen). My Lenovo NAS gave me hell with drivers and still has an unusable touchpad, so I'm incredibly grateful that HP was a little more open with its hardware.

That screen definitely still bothers me, but at least it won't be undergoing any regular open-close cycles. All things considered, it met most of my design criteria and constraints. I'd say I'm pretty satisfied with the way things turned out. Now if only I could figure out what to do with the laptop I replaced…
