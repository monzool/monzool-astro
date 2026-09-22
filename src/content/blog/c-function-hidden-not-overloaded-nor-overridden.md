---
title: "C++ Function Hidden, Not Overloaded Nor Overridden"
description: ''
pubDate: '2008-02-12'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "c"
  - "programming"
---

**THE C++ INHERITANCE** model can be unintuitive some times - or perhaps more correctly, its easy to get tricked by C++ in some circumstances.

When having an existing code base the need sometimes comes up, that an often used class is needed with a few additional features. Not to mess with any of existing code, a new class is created deriving from the original class. No functionality can be extended without breaking any existing code using the original code - sweet. But care is advised, or one might inadvertently step on a landmine.

The example below is a snippet from a boat class that provides a member for setting the speed of the boat. Positive values indicates forward sailing while negative values is backward sailing. Given the task of producing a super fast race boat a new class `FastBoat` is derived so that unrealistically high speeds can be executed.

```
class Boat
{
  public:
          virtual ~Boat() {}
          virtual void Speed(int speed)
          {
            std::cout << "Speed of boat: " << speed << std::endl;
          }
};

class FastBoat: public Boat
{
  public:
          virtual ~FastBoat() {}

          virtual void Speed(unsigned int speed)
          {
            std::cout << "Speed of fast boat: " << speed << std::endl;
          }
};

int main(int argc, char *argv[])
{
  std::cout << "Maneuvring the boat\n" << std::endl;

  const unsigned int ForwardKnots  = 22;
  const int          BackwardKnots = -3;

  FastBoat fastBoat;
  fastBoat.Speed(ForwardKnots);
  fastBoat.Speed(BackwardKnots);

  return EXIT_SUCCESS;
}

```

Glancing at the code one might be convinced that all is fine an dandy. Setting unsigned speeds on a `FastBoat` would trigger the `FastBoat` object, while signed speeds would propagate to the base `Boat` object.

This, however, is the output produced by the example code:

```
Speed of fast boat: 22
Speed of fast boat: 4294967293

```

Wanting to reverse the boat at mere 3 knots, the boat is sent forward at cartoon-fast speed. So what just happened?. Well, the `Boat::Speed` function was not called, and instead the `BackwardKnots` value was casted to fit the `FastBoat::Speed` function. This is because **function overload resolution does not cross inheritance boundaries** - that is, not by default. For the above code to work as intended, the hidden function from the base class must be brought into scope.

```
class FastBoat: public Boat
{
  public:
          virtual ~FastBoat() {}
          using Boat::Speed;    // Bring Boat::Speed function into scope
          virtual void Speed(unsigned int speed)
          {
            std::cout << "Speed of fast boat: " << speed << std::endl;
          }
};

```

Daring another attempt to test the program, the result now is as intended.

```
Speed of fast boat: 22
Speed of fast boat: -3

```

The `using` directive has brought the base class function into the namespace scope and is thus called correctly as it is no longer hidden.

Its an easy mistake to make and thats surely why other languages (e.g. D and C#) have introduced keyword for explicitly specifying what action intended. If using GCC compiling with the `-Woverloaded-virtual` options is recommended for catching these kind of mistakes.
