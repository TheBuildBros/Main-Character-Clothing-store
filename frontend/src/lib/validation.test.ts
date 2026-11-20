import assert from "node:assert/strict";
import {
  validateEmail,
  validatePhone,
  validateUsername,
  validatePassword,
  validateLoginIdentifier,
  normalizePhone,
} from "./validation";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(err);
  }
}

console.log("\n========================================");
console.log("RUNNING VALIDATION TEST SUITE");
console.log("========================================\n");

// ================================================================
// 1. EMAIL RULES TESTS
// ================================================================
console.log("1. EMAIL RULES:");

test("Accepts standard lowercase email with tag: user.name+tag@gmail.com", () => {
  const res = validateEmail("user.name+tag@gmail.com");
  assert.equal(res.valid, true);
  assert.equal(res.normalized, "user.name+tag@gmail.com");
});

test("Rejects uppercase letters with exact message: User@Gmail.com", () => {
  const res = validateEmail("User@Gmail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Email must use lowercase letters only.");
});

test("Rejects uppercase in domain: test@Mail.com", () => {
  const res = validateEmail("test@Mail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Email must use lowercase letters only.");
});

test("Rejects two dots in a row: a..b@x.com", () => {
  const res = validateEmail("a..b@x.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid email address.");
});

test("Rejects leading dot: .user@gmail.com", () => {
  const res = validateEmail(".user@gmail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid email address.");
});

test("Rejects trailing dot in local part: user.@gmail.com", () => {
  const res = validateEmail("user.@gmail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid email address.");
});

test("Rejects dot right after @: user@.gmail.com", () => {
  const res = validateEmail("user@.gmail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid email address.");
});

test("Rejects spaces: user name@gmail.com", () => {
  const res = validateEmail("user name@gmail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid email address.");
});

test("Rejects email exceeding 254 characters", () => {
  const longEmail = "a".repeat(250) + "@x.com";
  const res = validateEmail(longEmail);
  assert.equal(res.valid, false);
  assert.equal(res.error, "Email must not exceed 254 characters.");
});

// ================================================================
// 2. PHONE RULES TESTS
// ================================================================
console.log("\n2. PHONE RULES:");

test("Normalises +91 and symbols to 10 digits", () => {
  assert.equal(normalizePhone("+919812476530"), "9812476530");
  assert.equal(normalizePhone("+91 98124-76530"), "9812476530");
  assert.equal(normalizePhone("+91 (981) 247-6530"), "9812476530");
  assert.equal(normalizePhone("9812476530"), "9812476530");
});

test("Rejects wrong length: 9 digits (123456789)", () => {
  const res = validatePhone("123456789");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid 10-digit mobile number.");
});

test("Rejects wrong length: 11 digits (98124765301)", () => {
  const res = validatePhone("98124765301");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid 10-digit mobile number.");
});

test("Rejects starting with 0 (non-sequential): 0812476530", () => {
  const res = validatePhone("0812476530");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid 10-digit mobile number.");
});

test("Rejects starting with 5 (non-sequential): 5823761450", () => {
  const res = validatePhone("5823761450");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid 10-digit mobile number.");
});

test("Rejects 0123456789 (starts with 0 / sequential)", () => {
  const res = validatePhone("0123456789");
  assert.equal(res.valid, false);
});

test("Rejects 5876543210 (starts with 5 / sequential)", () => {
  const res = validatePhone("5876543210");
  assert.equal(res.valid, false);
});

test("Rejects letters in phone: 98765abcde", () => {
  const res = validatePhone("98765abcde");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid 10-digit mobile number.");
});

test("Rejects all same digit: 9999999999", () => {
  const res = validatePhone("9999999999");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects all same digit: 6666666666", () => {
  const res = validatePhone("6666666666");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects sequential increasing: 1234567890", () => {
  const res = validatePhone("1234567890");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects sequential increasing: 6789012345", () => {
  const res = validatePhone("6789012345");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects sequential increasing: 3456789012", () => {
  const res = validatePhone("3456789012");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects sequential decreasing: 9876543210", () => {
  const res = validatePhone("9876543210");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects sequential decreasing: 8765432109", () => {
  const res = validatePhone("8765432109");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects sequential with spaces: 98765 43210", () => {
  const res = validatePhone("98765 43210");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects repeated block: 9898989898", () => {
  const res = validatePhone("9898989898");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Rejects repeated block: 1212121212", () => {
  const res = validatePhone("1212121212");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Accepts valid Indian mobile without sequence: 9812476530", () => {
  const res = validatePhone("9812476530");
  assert.equal(res.valid, true);
  assert.equal(res.normalized, "9812476530");
});

test("Accepts valid Indian mobile with +91 prefix: +919812476530", () => {
  const res = validatePhone("+919812476530");
  assert.equal(res.valid, true);
  assert.equal(res.normalized, "9812476530");
});

test("Accepts valid Indian mobile without sequence: 9823761450", () => {
  const res = validatePhone("9823761450");
  assert.equal(res.valid, true);
  assert.equal(res.normalized, "9823761450");
});

// ================================================================
// 3. USERNAME RULES TESTS
// ================================================================
console.log("\n3. USERNAME RULES:");

test("Accepts valid lowercase username: main_character", () => {
  const res = validateUsername("main_character");
  assert.equal(res.valid, true);
});

test("Accepts valid lowercase username: user_1", () => {
  const res = validateUsername("user_1");
  assert.equal(res.valid, true);
});

test("Rejects reserved usernames: admin, root, login, checkout, etc.", () => {
  const reserved = [
    "admin",
    "root",
    "support",
    "account",
    "login",
    "signup",
    "collections",
    "cart",
    "checkout",
  ];
  for (const name of reserved) {
    const res = validateUsername(name);
    assert.equal(res.valid, false);
    assert.equal(res.error, "This username is reserved. Please choose another.");
  }
});

test("Rejects uppercase letters: User", () => {
  const res = validateUsername("User");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Username can use lowercase letters, numbers and underscores only."
  );
});

test("Rejects spaces: user name", () => {
  const res = validateUsername("user name");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Username can use lowercase letters, numbers and underscores only."
  );
});

test("Rejects symbols: user@name", () => {
  const res = validateUsername("user@name");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Username can use lowercase letters, numbers and underscores only."
  );
});

test("Rejects starting with number: 1user", () => {
  const res = validateUsername("1user");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Username cannot start with a number or underscore."
  );
});

test("Rejects starting with underscore: _user", () => {
  const res = validateUsername("_user");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Username cannot start with a number or underscore."
  );
});

test("Rejects too short (< 3 chars): ab", () => {
  const res = validateUsername("ab");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Username must be between 3 and 20 characters.");
});

test("Rejects too long (> 20 chars): 21 characters", () => {
  const res = validateUsername("a".repeat(21));
  assert.equal(res.valid, false);
  assert.equal(res.error, "Username must be between 3 and 20 characters.");
});

// ================================================================
// 4. PASSWORD RULES TESTS
// ================================================================
console.log("\n4. PASSWORD RULES:");

test("Accepts strong password: StrongP@ss1", () => {
  const res = validatePassword("StrongP@ss1");
  assert.equal(res.valid, true);
});

test("Rejects password < 8 characters: Short1!", () => {
  const res = validatePassword("Short1!");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Password must be at least 8 characters.");
});

test("Rejects password > 72 characters", () => {
  const res = validatePassword("A1!".padEnd(73, "a"));
  assert.equal(res.valid, false);
  assert.equal(res.error, "Password must not exceed 72 characters.");
});

test("Rejects missing lowercase: ALLUPPER1!", () => {
  const res = validatePassword("ALLUPPER1!");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Password must contain at least one lowercase letter."
  );
});

test("Rejects missing uppercase: alllower1!", () => {
  const res = validatePassword("alllower1!");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Password must contain at least one uppercase letter."
  );
});

test("Rejects missing number: NoNumber!aa", () => {
  const res = validatePassword("NoNumber!aa");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Password must contain at least one number.");
});

test("Rejects missing symbol: NoSymbol1aa", () => {
  const res = validatePassword("NoSymbol1aa");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Password must contain at least one symbol (!@#$%^&* etc.)."
  );
});

test("Rejects password containing username", () => {
  const res = validatePassword("MyAlex123!", { username: "alex" });
  assert.equal(res.valid, false);
  assert.equal(res.error, "Password must not contain your username.");
});

test("Rejects password containing email local part", () => {
  const res = validatePassword("MyJordan123!", {
    email: "jordan@example.com",
  });
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "Password must not contain your email local part."
  );
});

// ================================================================
// 5. LOGIN IDENTIFIER RULES TESTS
// ================================================================
console.log("\n5. LOGIN IDENTIFIER RULES:");

test("Login identifier routing: Uppercase email rejected with lowercase message", () => {
  const res = validateLoginIdentifier("Test@Mail.com");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Email must use lowercase letters only.");
});

test("Login identifier routing: Invalid phone (9 digits) rejected", () => {
  const res = validateLoginIdentifier("987654321");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Enter a valid 10-digit mobile number.");
});

test("Login identifier routing: Sequential phone rejected before request", () => {
  const res = validateLoginIdentifier("1234567890");
  assert.equal(res.valid, false);
  assert.equal(
    res.error,
    "This phone number looks invalid. Enter your real mobile number."
  );
});

test("Login identifier routing: Valid lowercase email accepted", () => {
  const res = validateLoginIdentifier("user@example.com");
  assert.equal(res.valid, true);
});

test("Login identifier routing: Valid phone accepted", () => {
  const res = validateLoginIdentifier("9812476530");
  assert.equal(res.valid, true);
  assert.equal(res.normalized, "9812476530");
});

console.log("\n========================================");
console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("========================================\n");

if (failed > 0) {
  process.exit(1);
}
