# privlytics

Basic web analytics, built to run within free tiers of various cloud providers.

Meant as a privacy preserving free alternative to the existing analytics 
services.

Originally designed as a solution for [removing GA on our Hackathons site](https://github.com/CovHack/CovHack2020/pull/24),
where we only needed basic information to track how well our marketing was
going and have an idea of page views.

## Components

### Web

Currently, this collects:
* the host name portion of the referer
* browser via [faisalman/ua-parser-js](https://github.com/faisalman/ua-parser-js)
* Time spent on page

To preserve runtime on the FaaS provider, we only call the function on
approximately 10% of page loads (configurable in the constructor). You just need
to multiple the number of hits by what 10 and you have fairly accurate visitor
count.

We respect DNT and check for it in before even checking if we are going to
sample the request.

### Backend

Their are two functions provided, a collector and a way of obtaining metrics.

The collector takes a POST request of the data provided to it via the code
running the browser.

The metrics are provided as an endpoint for it to be scrapped by prometheus
at regular intervals. It takes an key 

### Database

This uses FaunaDB to host the database.

### Visualisation

You can access the data by using prometheus and displaying the results using
an instance of Grafana.

You can run this on a raspberry Pi on your home network or on the many clouds
that offer this as a service.


## Possible Additions

Currently, we are only using this for a student event in the UK, so we really
don't care about the User Locations. If you care about where people are
approximately from, you could map the users IP in the function to their country.
