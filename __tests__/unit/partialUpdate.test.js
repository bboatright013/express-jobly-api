const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
      function () {
      
    const atable = "table";
    const items = ["key"];
    const akey = "key";
    const id = 1;
    
    let query = sqlForPartialUpdate(atable, items, akey, id);

    // FIXME: write real tests!
    expect(query).toEqual({"query" : "UPDATE table SET 0=$1 WHERE key=$2 RETURNING *", "values" : ["key", 1]});

  });
});
