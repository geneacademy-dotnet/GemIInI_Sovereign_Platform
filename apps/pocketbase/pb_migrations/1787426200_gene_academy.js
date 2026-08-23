/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Extend the shipped users collection with member fields.
    const users = app.findCollectionByNameOrId("users");

    const addField = (field) => {
      if (!users.fields.getByName(field.name)) users.fields.add(field);
    };

    addField(new TextField({ name: "full_name", max: 120 }));
    addField(new TextField({ name: "ga_id", max: 24 }));
    addField(
      new SelectField({
        name: "member_role",
        maxSelect: 1,
        values: ["student", "professional", "instructor", "organization"],
      }),
    );
    addField(new TextField({ name: "university", max: 160 }));
    addField(new NumberField({ name: "gp_points", onlyInt: true }));
    addField(
      new SelectField({
        name: "tier",
        maxSelect: 1,
        values: ["bronze", "silver", "gold", "platinum"],
      }),
    );
    addField(new BoolField({ name: "verified_member" }));
    addField(new BoolField({ name: "sudapass" }));
    addField(new TextField({ name: "workspace_url", max: 300 }));
    addField(new TextField({ name: "phone_masked", max: 40 }));

    users.listRule = "id = @request.auth.id";
    users.viewRule = "id = @request.auth.id";
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    users.deleteRule = "id = @request.auth.id";
    app.save(users);

    // 2. Public sanitized member directory (GA-ID lookup).
    let directory;
    try {
      directory = app.findCollectionByNameOrId("ga_directory");
    } catch (_) {
      directory = new Collection({
        type: "base",
        name: "ga_directory",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "ga_id", type: "text", required: true, max: 24 },
          { name: "name", type: "text", required: true, max: 120 },
          { name: "member_role", type: "text", max: 60 },
          { name: "university", type: "text", max: 160 },
          { name: "tier", type: "text", max: 24 },
          { name: "tier_label_ar", type: "text", max: 40 },
          { name: "verified", type: "bool" },
          { name: "sudapass", type: "bool" },
          { name: "phone_masked", type: "text", max: 40 },
          { name: "email_masked", type: "text", max: 80 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: ["CREATE UNIQUE INDEX idx_ga_directory_gaid ON ga_directory (ga_id)"],
      });
      app.save(directory);

      const seeds = [
        {
          ga_id: "GA-1042",
          name: "Dr. Rania Abdelrahman",
          member_role: "Instructor",
          university: "University of Khartoum",
          tier: "platinum",
          tier_label_ar: "بلاتيني",
          verified: true,
          sudapass: true,
          phone_masked: "+249 9** *** 118",
          email_masked: "r****@geneacademy.net",
        },
        {
          ga_id: "GA-2087",
          name: "Mohamed Elhassan",
          member_role: "Student",
          university: "Al-Neelain University",
          tier: "gold",
          tier_label_ar: "ذهبي",
          verified: true,
          sudapass: false,
          phone_masked: "+249 9** *** 204",
          email_masked: "m****@student.net",
        },
        {
          ga_id: "GA-3311",
          name: "Sara Yousif",
          member_role: "Professional",
          university: "Ahfad University for Women",
          tier: "silver",
          tier_label_ar: "فضي",
          verified: true,
          sudapass: true,
          phone_masked: "+971 5** *** 771",
          email_masked: "s****@clinic.org",
        },
        {
          ga_id: "GA-4520",
          name: "Ahmed Bakri",
          member_role: "Student",
          university: "Gezira University",
          tier: "bronze",
          tier_label_ar: "برونزي",
          verified: false,
          sudapass: false,
          phone_masked: "+249 9** *** 993",
          email_masked: "a****@student.net",
        },
      ];
      for (const data of seeds) {
        const r = new Record(directory);
        r.load(data);
        app.save(r);
      }
    }

    // 3. Public registration ingestion (write-only, admin review).
    try {
      app.findCollectionByNameOrId("ga_registrations");
    } catch (_) {
      const reg = new Collection({
        type: "base",
        name: "ga_registrations",
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "full_name", type: "text", required: true, max: 120 },
          { name: "email", type: "email", required: true },
          { name: "phone", type: "text", max: 40 },
          { name: "member_role", type: "text", max: 60 },
          { name: "university", type: "text", max: 160 },
          { name: "interest", type: "text", max: 500 },
          {
            name: "status",
            type: "select",
            maxSelect: 1,
            values: ["pending_review", "approved", "rejected"],
          },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(reg);
    }
  },
  (app) => {
    for (const name of ["ga_registrations", "ga_directory"]) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
      } catch (e) {
        if (!e.message.includes("no rows in result set")) throw e;
      }
    }
  },
);
