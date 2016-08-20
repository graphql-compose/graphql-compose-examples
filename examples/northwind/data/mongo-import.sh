#!/bin/sh

cd ./csv

DB_NAME="northwind"

mongo $DB_NAME --eval 'db.dropDatabase();'

for f in *.csv
do
    filename=$(basename "$f")
    extension="${filename##*.}"
    filename="${filename%.*}"
    mongoimport -d $DB_NAME -c "${filename}" --type csv --file "$f" --headerline
done

mongo $DB_NAME < ../mongo-shell-transform.js


collections=( categories customers employees orders products regions shippers suppliers )
for colname in "${collections[@]}"
do
  mongo $DB_NAME --quiet --eval "db.${colname}.find({}, {_id:0}).toArray();" > "../json/${colname}.json"
  sed -i '' -e "s/Cannot use \'commands\' readMode, degrading to \'legacy\' mode//g" "../json/${colname}.json"
done

# mongo $DB_NAME --quiet --eval "db.${COLLECTION_PREFIX}categories.find({}, {_id:0}).toArray();" > ../json/categories.json
# sed -i '' -e "s/Cannot use \'commands\' readMode, degrading to \'legacy\' mode//g" ../json/categories.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}customers" --out ../json/customers.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}employees" --out ../json/employees.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}orders" --out ../json/orders.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}products" --out ../json/products.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}regions" --out ../json/regions.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}shippers" --out ../json/shippers.json
# mongoexport --db $DB_NAME --collection "${COLLECTION_PREFIX}suppliers" --out ../json/suppliers.json

cd ..
