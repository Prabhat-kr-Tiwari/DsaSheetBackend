const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
// const PORT=process.env.PORT||5000
const app = express();

const url = "mongodb://dsaUser:secret@127.0.0.1:27017/Dsasheet";
let db;
(async () => {
  const client = await MongoClient.connect(url);
  db = client.db("Dsasheet");
})();
app.use(bodyParser.json());
// for all question
app.get("/problem", async (req, res) => {
  try {
    const questions = await db.collection("Problem").find().toArray();
    console.log("Questions:", questions);
    res.json({ data: questions });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.get("/category", async (req, res) => {
  try {
   


    const allProblemCategory = await db
      .collection("ProblemCategory")
      .find()
      .toArray();
    const result = {
      data: allProblemCategory,
    };

    const categoryIds = result.data.map((item) => item.category_id);

    //getting the unique category from all the data
    const uniqueCategoryIds = [...new Set(categoryIds)];
    

    let data
    //-------------category and title
    async function category(uniqueCategoryIds) {
      try {
        const object = {};

        const projection = { _id: 1, title: 1 }; // Define the fields you want to retrieve

         data = await db
          .collection("Category")
          .find({
            _id: { $in: uniqueCategoryIds.map((id) => new ObjectId(id)) },
          })
          .project(projection) // Apply the projection
          .toArray();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    category(uniqueCategoryIds);

   

   

    //----------------------------------
    //id and count
    async function countProblembycategoryId(categoryId) {
      const count = await db
        .collection("ProblemCategory")
        .countDocuments({ category_id: categoryId });
      return count;
    }

    async function fetchCountsForUniqueCategoryIds(uniqueCategoryIds) {
      const categoryCounts = {};

      for (const categoryId of uniqueCategoryIds) {
        const count = await countProblembycategoryId(categoryId);
        categoryCounts[categoryId] = count;
      }

      return categoryCounts;
    }

    fetchCountsForUniqueCategoryIds(uniqueCategoryIds)
      .then((categoryCounts) => {
        // Do something with the category counts, e.g., print or use the data.
        console.log(categoryCounts);
      })
      .catch((error) => {
        console.error(error);
      });

    //-----------------------------------------

    // Get the problem counts by category in the desired format.
    const categoryCounts = await fetchCountsForUniqueCategoryIds(
      uniqueCategoryIds
    );

  
    // Combine category data with problem counts and include the title.
    const finalData = uniqueCategoryIds.map((categoryId) => {
    const category = data.find((item) => item._id.toString() === categoryId);
    return {
      category_id: categoryId,
      title: category ? category.title : '', // Check if category is found
      problemCount: categoryCounts[categoryId] || 0, // Use 0 if count is not found
      // You can add more fields as needed.
    };
  });

    // Send the finalData as a response.
    res.json(finalData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});







//get category and count of all problem of that category
app.get("/problembycategory", async (req, res) => {
  try {
    const category_id_array = [];
    const ProblemCatorycount = await db
      .collection("ProblemCategory")
      .countDocuments();
    // console.log(ProblemCatorycount)
    const allProblemCategory = await db
      .collection("ProblemCategory")
      .find()
      .toArray();
    const result = {
      data: allProblemCategory,
    };
    // console.log(result)
    const categoryIds = result.data.map((item) => item.category_id);

    const uniqueCategoryIds = [...new Set(categoryIds)];
    console.log(uniqueCategoryIds);

    //-------------category and title
    async function category(uniqueCategoryIds) {
      try {
        const object = {};

        const projection = { _id: 1, title: 1 }; // Define the fields you want to retrieve

        const data = await db
          .collection("Category")
          .find({
            _id: { $in: uniqueCategoryIds.map((id) => new ObjectId(id)) },
          })
          .project(projection) // Apply the projection
          .toArray();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    // Usage example with your array of uniqueCategoryIds
    category(uniqueCategoryIds);

    //--------------------------------------

    // async function countProblembycategoryId(uniqueCategoryIds) {
    //   const count = await db
    //     .collection("ProblemCategory")
    //     .find({ category_id: uniqueCategoryIds });
    // }

    //const allProblembySpecificCategory=await db.collection('ProblemCategory').find({category_id:"653038ef9d483cb0598cdfdc"}).toArray()

    // res.json({ data: questions });

    //get the category id
    // {
    //     category_id1:4
    //     category_id1:1
    // }
    // {
    //     category_id:1
    //     problemCount:4
    //     category:Array
    // }
    // {
    //     category_id:1fhj
    //     problemCount:2
    //     category:String
    // }
    const ProblemCategory = await db.collection("ProblemCategory");

    //----------------------------------
    //id and count
    async function countProblembycategoryId(categoryId) {
      const count = await db
        .collection("ProblemCategory")
        .countDocuments({ category_id: categoryId });
      return count;
    }

    async function fetchCountsForUniqueCategoryIds(uniqueCategoryIds) {
      const categoryCounts = {};

      for (const categoryId of uniqueCategoryIds) {
        const count = await countProblembycategoryId(categoryId);
        categoryCounts[categoryId] = count;
      }

      return categoryCounts;
    }

    fetchCountsForUniqueCategoryIds(uniqueCategoryIds)
      .then((categoryCounts) => {
        // Do something with the category counts, e.g., print or use the data.
        console.log(categoryCounts);
      })
      .catch((error) => {
        console.error(error);
      });

    //-----------------------------------------

    // category_id_array=ProblemCategory.find({category_id}).toArray()
    // console.log(category_id_array)

    //const allProblembySpecificCategory=await db.collection('ProblemCategory').find({category_id:"653038ef9d483cb0598cdfdc"}).toArray()
    // console.log(allProblembySpecificCategory)

    const category_count = await db
      .collection("ProblemCategory")
      .countDocuments({ category_id: "653038ef9d483cb0598cdfdc" });
    //    console.log(category_count)
    res.json({ data: category_count });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.get("/", async (req, res) => {
  const json = [
    {
      image:
        "https://photos.google.com/album/AF1QipMSXNj0tPrbenaiyJr1XWGOkx5JbUlkqhBE2nCv/photo/AF1QipO9YThfmYrVHEASOu8aKrAXjboekxNf8LNacXnU",
      text: "Offers & more",
      textdescription: "& more",
    },
  ];
  res.send(json);
});

app.get("/problems-with-category", async (req, res) => {
  const problems = await db.collection("Problem").find().toArray();
  const categories = await db.collection("Category").find().toArray();
  const problemCategory = await db
    .collection("ProblemCategory")
    .find()
    .toArray();

  const result = [];

  // problemCategory.map((pc) => {
  //     const _problems = problems.filter((p) => p._id == pc.problem_id)
  //     const _category = categories.filter((c) => c._id == pc.category_id)
  //     if(result[_category.title]){

  //     }else{
  //         result[_category.title] = _category.title
  //     }
  // })

  return res.json({
    result,
  });
});
app.listen(5000, (request, response) => {
  console.log(`server is listening on 5000`);
});
