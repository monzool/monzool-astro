---
title: "Numbers To Strings And Back Again - Standard C++ vs. Boost"
description: ''
pubDate: '2008-05-06'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "c"
  - "programming"
---

**CONVERTING NUMBERS TO** strings or the opposite of converting strings to numbers, is an operation that is far from as trivial as one would expect from such an obvious task - at least when it comes to C++ programming using standard libraries. The converting can be performed by the `iostringstream` classes in the standard library. When searching Google for the C++ way of converting between numbers and streams, the `stringstream` library classes appears not to be the that well known, and especially its features of the number and string operations seems generally to be unknown by many.

The `stringstream` offers a large range of manipulating stream data, although if used for e.g. special formatted textual output, the implementation steps tends to be somewhat more cumbersome than the old printf family.

The example below takes a few more lines that doing e.g. a `atoi` or `snprintf` kind of operation, but depending on the situation, simple conversion scenarios do not require many lines of code.

#### Standard Input / Output Streams Library

The main function is extracted here, just not to obfuscate the picture of the actual converting. Note that `stringstream` is defined in the header.

```cpp
#include 
#include   // stringstream

// Prototypes
void Std_StringToInteger();
void Std_IntegerToString();

int main(int argc, char *argv[])
{
  std::cout << "Std_StringToInteger:" << std::endl;
  Std_StringToInteger();
  std::cout << "Std_IntegerToString:" << std::endl;
  Std_IntegerToString();
}

```

The function below handles conversion from strings to integers. First a simple conversion is done, then followed by an example of testing whether the conversion operation was a success. Last is shown how to enable exceptions on conversion errors.

```cpp
void Std_StringToInteger()
{
  std::string str = "1976";
  int val;

  // Load stringstream with text to convert
  std::istringstream is(str);
  // Convert by streaming to integer
  is >> val;
  std::cout << "  Val: " << val << std::endl;

  // Clear stream for another input
  is.clear();

  // Load stream with a non numeric convertible data
  is.str("Monzool.net");
  is >> val;

  // Test if conversion failed
  if (is.fail())
    std::cout << "  Conversion failed!" << std::endl;

  // Enable exceptions on conversion errors
  try
  {
    // Set failures to be thrown as exceptions
    is.exceptions(std::istringstream::eofbit  |
                  std::istringstream::failbit |
                  std::istringstream::badbit);
  }
  catch(std::istringstream::failure& e)
  {
    std::cout << "  Exception: " << e.what() << std::endl;
    std::cout << "  Conversion failed!" << std::endl;
  }
}

```

As the naming `stringstream` indicates, input and output is done by streaming measures. If not quite confident on stream directions, think of how functions `cout` and `cin` is used. Using `stringstream` is no different.

Last function is for converting from numbers to strings.

```cpp
void Std_IntegerToString()
{
  int val = 1976;

  // Create empty stringstream for number to convert
  std::ostringstream os("");
  // Convert by streaming integer
  os << val;
  std::cout << "  Str: " <<  os.str() << std::endl;
}

```

#### Boost lexical\_cast

To put it simple: when dealing with libraries for converting between numbers and strings the Boost library **smokes** the standard C++ library ditto.

The conversion features of Boost is located in the [`lexical_cast`](http://www.boost.org/doc/libs/1_35_0/libs/conversion/lexical_cast.htm) library and is embedded by including the `lexical_cast.hpp` file (most Boost libraries are implemented in header files and can be embedded by including the appropriate hpp file.).

```cpp
#include 
#include 

// Prototypes
void Boost_StringToInteger();
void Boost_IntegerToString();

int main(int argc, char *argv[])
{
  std::cout << "Boost_StringToInteger:" << std::endl;
  Boost_StringToInteger();
  std::cout << "Boost_IntegerToString:" << std::endl;
  Boost_IntegerToString();
}

```

Instead of using streaming functionality, Boost has chosen a much more obvious concept. Boost has added the functionality of simply casting between numbers and strings. Casting functions are already a familiar concept in C++, like casting between data types using `static_cast` or manipulating const'ness with `const_cast`.

The `lexical_cast` template function makes converting from string to integer trivial. The example below also shows how to handle conversion errors by exception handling.

```cpp
void Boost_StringToInteger()
{
  std::string str = "1976";
  // Cast string to integer
  int val = boost::lexical_cast(str);
  std::cout << "  Val: " << val << std::endl;

  // Load string with non numeric convertible data
  str = "Monzool.net";
  try
  {
    // Non convertible values throws exceptions
    val = boost::lexical_cast(str);
  }
  catch (boost::bad_lexical_cast &e)
  {
    std::cout << "  Exception: " << e.what() << std::endl;
    std::cout << "  Conversion failed!" << std::endl;
  }
}

```

Converting the other way from integer to string is just as trivial.

```cpp
void Boost_IntegerToString()
{
  int val = 1976;
  // Cast integer to string
  std::string str = boost::lexical_cast(val);
  std::cout << "  Str: " << str << std::endl;
}
```

When it comes to simple conversion between numbers and strings, Boost is far superior in simplicity. However note that the design goals have also been very different for the two libraries. The C++ Standard Input/Output Streams Library has been designed for flexibility. And flexible it is indeed, but sadly this side effects to complicating its usage even for obvious tasks that ought to be trivial to perform.
