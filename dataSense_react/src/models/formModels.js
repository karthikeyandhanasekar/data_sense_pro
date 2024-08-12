export const formConfigs = [
  {
    grid: {
      container: true,
      spacing: 2,
      items: [
        {
          item: {
            xs: 12,
            md: 4,
            component: {
              type: "InputField",
              props: {
                id: "email",
                label: "Email",
                type: "email",
                name: "email",
                value: "formData?.email",
                onChange: "onchangeInput",
                required: true,
                ref: "inputRefs.current['email']",
              },
            },
          },
        },
        {
          item: {
            xs: 12,
            component: {
              type: "InputField",
              props: {
                id: "email",
                label: "Email",
                type: "email",
                name: "email",
                value: "formData?.email",
                onChange: "onchangeInput",
                required: true,
                ref: "inputRefs.current['email']",
              },
            },
          },
        },
        {
          item: {
            xs: 12,
            component: {
              type: "InputField",
              props: {
                id: "password",
                label: "Password",
                type: "password",
                name: "password",
                value: "formData?.password",
                onChange: "onchangeInput",
                required: true,
                ref: "inputRefs.current['password']",
              },
            },
          },
        },
        {
          item: {
            xs: 12,
            container: true,
            justifyContent: "flex-end",
            style: {
              gap: "1rem",
            },
            components: [
              {
                type: "ButtonComponent",
                props: {
                  type: "submit",
                  label: "Login",
                  variant: "contained",
                  onClick: null,
                },
              },
              {
                type: "ButtonComponent",
                props: {
                  type: "reset",
                  label: "Reset",
                  onClick: null,
                },
              },
            ],
          },
        },
      ],
    },
  },
];
