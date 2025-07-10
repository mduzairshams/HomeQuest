const ExpressError = require("../utils/ExpressError")
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let allListings;
    let searchQuery = {};
    if (search) {
        const regex = new RegExp(search, 'i');
        searchQuery = { $or: [ { title: regex }, { location: regex } ] };
    }
    if (category) {
        allListings = await Listing.find({ ...searchQuery, category: category });
    } else if (search) {
        allListings = await Listing.find(searchQuery);
    } else {
        allListings = await Listing.find();
    }
    res.render("../views/listings/home.ejs", { allListings, selectedCategory: category || null, searchTerm: search || '' });
}

module.exports.newListing =  (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.add = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit: 1    
    })
    .send()

    console.log(response.body.features[0].geometry.coordinates) 
    let url = req.file.path
    let filename= req.file.filename
    console.log(url, "..", filename)
    const newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id
    newListing.image = {url, filename}

    newListing.geometry = response.body.features[0].geometry

    let savedListing = await newListing.save()
    console.log(savedListing)
    await newListing.save()
    req.flash("success", "New listing created!")
    res.redirect("/listings")
}

module.exports.showListing = async(req, res) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
        .populate({path:"reviews",
             populate:{
                path:"author"
            }
        })
        .populate("owner")
        
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist")
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing})
}

module.exports.editListing =  async (req, res) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist")
        return res.redirect("/listings")
    }
    let originalImage = listing.image.url
    originalImage = originalImage.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs",{listing, originalImage})
}

module.exports.updateInDB = async(req, res) => {
    if(!req.body.listings){
        throw new ExpressError(400, "Bad request Bhaiya sahi data do yaar me update kaise karu yaar");
    }
    let {id} = req.params
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listings})
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename= req.file.filename
        console.log(url, "..WORKING", filename)
        listing.image = {url, filename}
        await listing.save()
    }
    req.flash("success", "Listing Updated Successfully")

    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let {id}= req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing deleted!")
    res.redirect("/listings")
}

module.exports.liveSearch = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') return res.json([]);
  const regex = new RegExp(q, 'i');
  const listings = await Listing.find({ $or: [ { title: regex }, { location: regex } ] })
    .limit(8)
    .select('_id title location');
  res.json(listings);
};