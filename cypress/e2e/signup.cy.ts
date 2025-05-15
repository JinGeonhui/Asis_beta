describe("회원가입 페이지 테스트", () => {
  beforeEach(() => {
    cy.visit("/Signup");
  });

  it("모든 입력창이 존재하는지 확인", () => {
    cy.get('input[placeholder="이름을 입력해주세요"]').should("exist");
    cy.get('input[placeholder="나이를 입력해주세요"]').should("exist");
    cy.get('input[placeholder="이메일을 입력해주세요"]').should("exist");
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').should("exist");
    cy.get('input[placeholder="비밀번호를 확인해주세요"]').should("exist");
  });

  it("입력값을 입력하고 제출 버튼을 누르면 요청이 전송되는지 확인 (비밀번호 일치하지 않을 경우)", () => {
    cy.intercept("POST", "**/signUp").as("signUpRequest");

    cy.get('input[placeholder="이름을 입력해주세요"]').type("정승표");
    cy.get('input[placeholder="나이를 입력해주세요"]').type("18");
    cy.get('input[placeholder="이메일을 입력해주세요"]').type(
      "s23052@gsm.hs.kr",
    );
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').type("password");
    cy.get('input[placeholder="비밀번호를 확인해주세요"]').type("password");

    cy.get("button").contains("확인").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("비밀번호가 일치하지 않습니다.");
    });
  });

  it("비밀번호 토글 버튼 클릭 시 텍스트로 표시되는지 확인", () => {
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').should(
      "have.attr",
      "type",
      "password",
    );
    cy.get('input[placeholder="비밀번호 확인해주세요"]').should(
      "have.attr",
      "type",
      "password",
    );

    // 비밀번호 보기 토글 버튼 클릭
    cy.get("div").eq(10).click(); // 위치에 따라 바뀔 수 있음
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').should(
      "have.attr",
      "type",
      "text",
    );

    cy.get("div").eq(12).click(); // 위치에 따라 바뀔 수 있음
    cy.get('input[placeholder="비밀번호 확인해주세요"]').should(
      "have.attr",
      "type",
      "text",
    );
  });
});
