describe("메인 페이지 테스트", () => {
    it("홈 페이지가 정상적으로 로드되는지 확인", () => {
      cy.visit("/");
      cy.contains("Hello, World!");
    });
  });
  